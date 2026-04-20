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
	const [displayToolTip, setDisplayToolTip] = useState<string>('')

	const [timeOutTipIn, setTimeOutTipIn] = useState<ReturnType<typeof setTimeout>[]>([])

	const onMouseEnterToolTip = (id: string) => {
		timeOutTipIn.forEach(t => clearTimeout(t))

		setDisplayToolTip(id)
	}
	const onMouseLeaveToolTip = () => {
		const resetList = []
		const resetTime = setTimeout(() => {
			setDisplayToolTip('')
		}, 1000)
		resetList.push(resetTime)
		setTimeOutTipIn(resetList)
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
						{tip && (
							<ToolTip
								id={id}
								tipMessage={tipMessage}
								displayToolTip={displayToolTip}
								onMouseEnterToolTip={onMouseEnterToolTip}
								onMouseLeaveToolTip={onMouseLeaveToolTip}
							/>
						)}
					</div>
					<div className={styles.formInput}>
						<input
							id={id}
							value={type === 'datetime-local' ? dateToDateTimeLocal(value) : (value ?? '')}
							onChange={e => {
								const value = e.target.value

								if (type === 'number') {
									onChange(value === '' ? undefined : Number(value))
								} else if (type === 'datetime-local') {
									onChange(value ? new Date(value) : null)
								} else {
									onChange(value)
								}
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
