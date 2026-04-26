import type { ChangeEvent, MouseEvent } from 'react'
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import type { CategoryProps } from '../../../types/types'
import ToolTip from '../ToolTip/ToolTip'
import styles from './RHFCategorySelect.module.scss'
interface RHFCategorySelectProps<T extends FieldValues> {
	name: Path<T>
	id: string
	options: CategoryProps[] | { name: string }[]
	label: string
	max: number
	// styles: Record<string, string>
	isSubmitting?: boolean
	tipMessage?: string
	required?: boolean
	tip?: boolean
}

const RHFCategorySelect = <T extends FieldValues>({
	name,
	id,
	options,
	label,
	max,
	tipMessage,
	isSubmitting,
	tip = true,
	required = true,
}: RHFCategorySelectProps<T>) => {
	const { control, setError } = useFormContext<T>()

	const handleSelectCategory = (
		e: MouseEvent<HTMLLabelElement> | ChangeEvent<HTMLInputElement>,
		value: string[],
		onChange: (value: string[]) => void,
	) => {
		const target = e.target as HTMLLabelElement
		const el = target.id
		if (!el) return

		if (value.length > 0 && value.includes(el)) {
			onChange(value.filter(v => v !== el))
		} else if (value.length < max) {
			const newValue = value.filter(v => options.map(op => op.name).includes(v))

			onChange([...newValue, el])
		} else if (value.length === max) {
			setError(name, { type: 'manual', message: `You can select up to ${max} categories` })

			setTimeout(() => {
				setError(name,{message:''})
			}, 2000);
		}
	}

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value = [] as string[], onChange }, fieldState: { error } }) => (
				<div className={styles.categoriesContainer}>
					<div className={`${styles.labelBox}`}>
						<span className={`${styles.selectedCategoriesTitle} ${required ? styles.spanAfter : ''}`}>{label}</span>
						{tip && <ToolTip id={id} tipMessage={tipMessage} isSubmitting={isSubmitting} />}
					</div>

					<div className={`${styles.categoriesOptions}`}>
						{[...options]
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((option, index) => {
								const disabled = value.length > max && !value.includes(option.name)
								const isChecked = value.includes(option.name)

								return (
									<label
										htmlFor={option.name}
										key={index}
										className={`${styles.checkbox} ${isChecked ? styles.checked : ''}`}>
										<input
											id={option.name}
											value={option.name}
											type="checkbox"
											checked={isChecked}
											disabled={isSubmitting ? isSubmitting : disabled}
											onChange={e => handleSelectCategory(e, value, onChange)}
										/>

										{option.name}
									</label>
								)
							})}
					</div>
					{error && <span className={styles.error}>{error.message}</span>}
				</div>
			)}
		/>
	)
}

export default RHFCategorySelect
