import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'

import {  type ReactNode, type RefObject } from 'react'
import { UploadSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import styles from './RHFAddFile.module.scss'
import ToolTip from '../ToolTip/ToolTip'
interface RHFAddFileProps<T extends FieldValues> {
	children?: ReactNode
	name: Path<T>
	label?: string

	fileRef?: RefObject<(HTMLInputElement | null)[]>
	fileIndex: number
	id: string
	isSubmitting?: boolean
	className?: string
	tip?: boolean
	required?: boolean
	tipMessage?: string
}

const RHFAddFile = <T extends FieldValues>({
	name,
	id,
	label,
	isSubmitting,
	fileRef,
	fileIndex,
	children,
	className,
	tip = true,
	tipMessage,
	required = true,
}: RHFAddFileProps<T>) => {
	const { control } = useFormContext()
	
	return (
		<Controller
			control={control}
			name={`${name}`}
			render={({ field: { value, onChange }, fieldState: { error } }) => {
				return (
					<div className={`${styles.fileWrapper} ${className ? className : ''}`}>
						<div className={`${styles.labelBox}`}>
							<p className={`${styles.fileTitle} ${required && styles.labelAfter}`}>{label && `${label}`}</p>
							{tip && (
								<ToolTip
									id={id}
									tipMessage={tipMessage}
									
								/>
							)}
						</div>
						<label htmlFor={id} className={`${styles.uploadFile} ${value && styles.uploadFilled}`}>
							<div className={`${styles.uploadFileShadow} `}>
								<UploadSVG />
							</div>
							{typeof value === 'string' ? (
								<img src={value} alt="Preview image" className={styles.previewImage} />
							) : (
								(value as File) instanceof File && (
									<img src={URL.createObjectURL(value)} alt="Preview image" className={styles.previewImage} />
								)
							)}
						</label>
						<input
							ref={el => {
								if (fileRef && fileIndex === -1) {
									fileRef.current[0] = el
								} else if (fileRef) {
									fileRef.current[fileIndex] = el
								}
							}}
							id={id}
							className={styles.fileInput}
							onChange={e => {
								const file = e.target.files?.[0]
								if (!file) return
								onChange(file)
							}}
							type="file"
							disabled={isSubmitting}
							aria-describedby={error ? `${id}-error` : undefined}
						/>
						{error && (
							<span id={`${id}-error`} className={`${styles.error} ${error ? styles.marginError : ''}`}>
								{error.message}
							</span>
						)}
						{children}
					</div>
				)
			}}
		/>
	)
}

export default RHFAddFile
