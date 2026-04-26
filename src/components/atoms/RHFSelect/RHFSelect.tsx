import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import styles from './RHFSelect.module.scss'
import ToolTip from '../ToolTip/ToolTip'

interface RHFSelectProps<T extends FieldValues> {
	name: Path<T>
	label: string
	options: {
		name: string
		id?: string
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
								const target = e.target.value

								if (target === 'true') {
									onChange(true)
									return
								}
								if (target === 'false') {
									onChange(false)
									return
								}

								onChange(target)
							}}
							className={styles.selectOption}
							value={value ?? ''}
							disabled={isSubmitting}
							aria-disabled={isSubmitting}
							id={id}>
							<>
								<option value="null">----</option>
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
