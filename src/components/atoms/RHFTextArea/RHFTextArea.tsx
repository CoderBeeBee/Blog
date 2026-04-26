import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import { mergeRefs } from 'react-merge-refs'
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import MiniMarkdownToolbar from '../../modules/MiniMarkdownToolbar/MiniMarkdownToolbar'
import styles from './RHFTextArea.module.scss'
import ToolTip from '../ToolTip/ToolTip'
interface RHFTextAreaProps<T extends FieldValues> {
	name: Path<T>
	label: string
	className?: string
	id: string
	isSubmitting?: boolean
	placeholder?: string
	markdown?: boolean
	tip?: boolean
	tipMessage?: string
	required?: boolean
}

const RHFTextArea = <T extends FieldValues>({
	name,
	label,

	placeholder,
	isSubmitting,
	className,
	id,
	markdown = true,
	tip = true,
	tipMessage,
	required = true,
}: RHFTextAreaProps<T>) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const { control } = useFormContext()

	// const [displayToolTip, setDisplayToolTip] = useState<string>('')

	// const [timeOutTipIn, setTimeOutTipIn] = useState<ReturnType<typeof setTimeout>[]>([])

	// const onMouseEnterToolTip = (id: string) => {
	// 	timeOutTipIn.forEach(t => clearTimeout(t))

	// 	setDisplayToolTip(id)
	// }
	// const onMouseLeaveToolTip = () => {
	// 	const resetList = []
	// 	const resetTime = setTimeout(() => {
	// 		setDisplayToolTip('')
	// 	}, 1000)
	// 	resetList.push(resetTime)
	// 	setTimeOutTipIn(resetList)
	// }

	const handleKeyDown =
		(onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key !== 'Enter') return

			const textarea = e.currentTarget
			const { selectionStart, selectionEnd, value } = textarea

			const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
			const line = value.slice(lineStart, selectionStart)

			const match = line.match(/^(\d+)\.\s(.*)$/)
			if (!match) return

			e.preventDefault()

			const currentNumber = Number(match[1])
			const contentAfter = match[2]

			let newValue = value
			let newCursorPos = selectionStart

			// pusta linia → zakończ listę
			if (contentAfter.trim() === '') {
				newValue = value.slice(0, lineStart) + '\n' + value.slice(selectionEnd)

				newCursorPos = lineStart + 1
			} else {
				const nextLine = `\n${currentNumber + 1}. `
				newValue = value.slice(0, selectionStart) + nextLine + value.slice(selectionEnd)

				newCursorPos = selectionStart + nextLine.length
			}

			// 🔥 RHF potrzebuje event
			const changeEvent = {
				target: { value: newValue },
			} as unknown as React.ChangeEvent<HTMLTextAreaElement>

			onChange(changeEvent)

			requestAnimationFrame(() => {
				textarea.setSelectionRange(newCursorPos, newCursorPos)
			})
		}
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
				<div className={`${styles.textAreaContainer} `}>
					<div className={`${styles.labelBox}`}>
						<label htmlFor={id} className={`${required && styles.labelAfter}`}>
							{label && `${label}`}
						</label>
						{tip && <ToolTip id={id} tipMessage={tipMessage} isSubmitting={isSubmitting} />}
					</div>

					<div className={`${styles.textareaWrapper} ${isFocused ? styles.focusArea : ''}`}>
						<textarea
							id={id}
							onChange={e => {
								const target = e.target.value
								onChange(target)
							}}
							value={value}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							onKeyDown={handleKeyDown(onChange)}
							ref={mergeRefs([ref, textareaRef])}
							readOnly={isSubmitting}
							aria-readonly={isSubmitting}
							aria-invalid={!!error}
							aria-describedby={error ? `${id}-error` : undefined}
							placeholder={placeholder}
						/>
						{markdown && (
							<MiniMarkdownToolbar
								isSubmitting={isSubmitting}
								className={className}
								textareaRef={textareaRef}
								value={value}
								onChange={onChange}
							/>
						)}
					</div>
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

export default RHFTextArea
