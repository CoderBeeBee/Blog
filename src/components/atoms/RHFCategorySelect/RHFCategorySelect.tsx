import type { ChangeEvent, MouseEvent } from 'react'
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import type { CategoryProps } from '../../../types/types'


interface RHFCategorySelectProps<T extends FieldValues> {
	name: Path<T>

	options: CategoryProps[] | { name: string }[]
	label: string
	max: number
	styles: Record<string, string>
	isSubmitting?: boolean
}

const RHFCategorySelect = <T extends FieldValues>({
	name,
	options,
	label,
	max,
	styles,
	isSubmitting,
}: RHFCategorySelectProps<T>) => {
	const { control } = useFormContext<T>()

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
			onChange([...value, el])
		}
	}

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value = [] as string[], onChange }, fieldState: { error } }) => (
				<div className={styles.categoriesContainer}>
					<span className={styles.selectedCategoriesTitle}>{label}:</span>
					{error && <span className={styles.error}>{error.message}</span>}
					
					<div className={`${styles.categoriesOptions}`}>
						{options.map((option, index) => {
							const disabled = value.length > max && !value.includes(option.name)
							const isChecked = value.includes(option.name)

							return (
								<label htmlFor={option.name} key={index} className={`${styles.checkbox} ${isChecked ? styles.checked : ''}`}>
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
				</div>
			)}
		/>
	)
}

export default RHFCategorySelect
