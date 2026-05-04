import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import styles from './RHFSelect.module.scss'
import ToolTip from '../ToolTip/ToolTip'

interface RHFSelectProps<T extends FieldValues> {
	name: Path<T>
	label: string
	options: {
		name: string
		id?: string | number
	}[]

	isSubmitting?: boolean
	id: string
	tip?: boolean
	tipMessage?: string
	required?: boolean
}

const RHFSelect = <T extends FieldValues>({
	name,
	label,
	id,
	options,
	isSubmitting = false,
	tip = true,
	tipMessage,
	required = true,
}: RHFSelectProps<T>) => {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				
				return (
					<div className={styles.selectContainer}>
						<div className={`${styles.labelBox}`}>
							<label htmlFor={id} className={`${styles.selectTitle} ${required && styles.labelAfter}`}>
								{label && `${label}`}
							</label>
							{tip && <ToolTip id={id} tipMessage={tipMessage} isSubmitting={isSubmitting} />}
						</div>
						<select
							onChange={e => {
								const value = e.target.value

								if (value === 'true') {
									onChange(true)
									return
								}
								if (value === 'false') {
									onChange(false)
									return
								}

								onChange(value)
							}}
							className={styles.selectOption}
							value={value ? value : ''}
							disabled={isSubmitting}
							aria-disabled={isSubmitting}
							
							id={id}>
							<>
								<option value="">----</option>
								{options &&
									options.map((option, index) => (
										<option key={index} value={option.id}>
											{option.name}
										</option>
									))}
							</>
						</select>
						{error && <span className={styles.error}>{error.message}</span>}
					</div>
				)
			}}
		/>
	)
}

export default RHFSelect
