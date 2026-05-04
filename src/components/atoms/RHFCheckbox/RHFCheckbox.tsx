import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'
// import CheckMark from '../Checkmark/CheckMark'
import type { ReactNode } from 'react'
import styles from './RHFCheckbox.module.scss'
interface RHFInputProps<T extends FieldValues> {
	name: Path<T>
	label?: string
	
	id: string
	children?: ReactNode
	placeholder?: string

	isSubmitting?: boolean
}

const RHFCheckbox = <T extends FieldValues>({
	name,
	placeholder,
	label,
	
	id,
	children,
	isSubmitting = false,
}: RHFInputProps<T>) => {
	const { control } = useFormContext()
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<div className={styles.formCheckbox}>
					<label htmlFor={id}>
						{label && `${label}`}

						{children}
					</label>
					<input
						value={value ?? ''}
						id={id}
						onChange={e => {
							const value = e.target.checked
							onChange(value)
						}}
						type="checkbox"
						checked={!!value}
						placeholder={placeholder}
						disabled={isSubmitting}
						aria-readonly={isSubmitting}
						aria-invalid={!!error}
						aria-describedby={error ? `${id}-error` : undefined}
					/>
					{error && (
						<span id={`${id}-error`} className={styles.error}>
							{error.message}
						</span>
					)}
				</div>
			)}
		/>
	)
}

export default RHFCheckbox
