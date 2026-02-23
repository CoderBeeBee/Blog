import type { ReactNode } from 'react'
import styles from './FormBtn.module.scss'
interface FormBtnProps {
	children: ReactNode
	type: 'submit' | 'button'
	isSubmitting?: boolean
	handleResetFields?: () => void
	handleResend?: () => void
	onClick?:()=>void
	className: string
	ariaLabel?:string
}

const FormBtn = ({ children, isSubmitting,onClick, handleResetFields,handleResend,ariaLabel, className, type }: FormBtnProps) => {
	return (
		<button
			type={type}
			disabled={isSubmitting}
			onClick={() => {
				onClick?.()
				handleResetFields?.()
				handleResend?.()
			}}
			aria-label={ariaLabel}
			className={` ${styles.postFormBtn} ${className ? className : ''}`}>
			{children}
		</button>
	)
}

export default FormBtn
