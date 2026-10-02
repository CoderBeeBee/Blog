import { useState, type ReactNode } from 'react'
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import InputShowHideButton from '../InputShowHideButton/InputShowHideButton'
import useDateToDateTimeLocal from '../../../hooks/useDateTimeLocal'
import styles from './RHFInput.module.scss'

import ToolTip from '../ToolTip/ToolTip'
interface RHFInputProps<T extends FieldValues> {
	children?: ReactNode
	name: Path<T>
	label?: string
	id: string
	type: 'text' | 'number' | 'password' | 'email' | 'date' | 'datetime-local'
	placeholder?: string
	tip?: boolean
	isSubmitting?: boolean
	className?: string
	tipMessage?: string
	required?: boolean
}
type InputType = RHFInputProps<FieldValues>['type']
const RHFInput = <T extends FieldValues>({
	name,
	placeholder,
	label,
	id,
	type = 'text',
	isSubmitting = false,
	children,
	tip = true,
	tipMessage,
	className,
	required = true,
}: RHFInputProps<T>) => {
	const { dateToDateTimeLocal } = useDateToDateTimeLocal()
	const [visible, setVisible] = useState<boolean>(false)
	const { control } = useFormContext()

	const getInputValue = (type: InputType, value: string) => {
		if (type === 'datetime-local') {
			return dateToDateTimeLocal(value)
		}

		return value ?? ''
	}

	const getFormValue = (type: InputType, value: string) => {
		if (type === 'number') {
			return value === '' ? undefined : Number(value)
		}

		if (type === 'datetime-local') {
			return value ? new Date(value) : null
		}

		return value
	}

	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<div className={`${styles.formInputBox} ${className ? className : ''}`}>
					<div className={`${styles.labelBox}`}>
						<label htmlFor={id} className={`${required && styles.labelAfter}`}>
							{label && `${label}`}
						</label>
						{tip && <ToolTip id={id} tipMessage={tipMessage} isSubmitting={isSubmitting} />}
					</div>
					<div className={styles.formInput}>
						<input
							id={id}
							value={getInputValue(type,value)}
							// value={type === 'datetime-local' ? dateToDateTimeLocal(value) : (value ?? '')}
							onChange={e => {
								const value = e.target.value
								onChange(getFormValue(type,value))
								// if (type === 'number') {
								// 	onChange(value === '' ? undefined : Number(value))
								// } else if (type === 'datetime-local') {
								// 	onChange(value ? new Date(value) : null)
								// } else {
								// 	onChange(value)
								// }
							}}
							type={type === 'password' ? (visible === false ? type : 'text') : type}
							placeholder={placeholder}
							readOnly={isSubmitting}
							aria-readonly={isSubmitting}
							aria-invalid={!!error}
							aria-describedby={error ? `${id}-error` : undefined}
						/>
						{type === 'password' && (
							<InputShowHideButton visible={visible} isSubmitting={isSubmitting} onToggle={() => setVisible(v => !v)} />
						)}
					</div>
					{error && (
						<span id={`${id}-error`} className={styles.error}>
							{error.message}
						</span>
					)}
					{children}
				</div>
			)}
		/>
	)
}

export default RHFInput
