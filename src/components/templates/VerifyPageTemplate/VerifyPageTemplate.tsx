import { Navigate, useLocation } from 'react-router'
import { useResendVerificationMutation, useVerifyAccountQuery } from '../../../slices/api/userApi'
import styles from './VerifyPageTemplate.module.scss'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
const VerifyPageTemplate = () => {
	const { search } = useLocation()

	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [disabled, setDisabled] = useState<boolean>(false)
	const [countdown, setCountdown] = useState<number>(0)
	const query = new URLSearchParams(search)
	const token = query.get('token')
	const email = query.get('email')

	const { data, error, isLoading } = useVerifyAccountQuery(token)
	const [resendVerificationToken] = useResendVerificationMutation()

	useEffect(() => {
		// Jeśli mamy dane z API z sukcesem
		if (data && typeof data === 'object') {
			if ('message' in data) {
				setSuccessMessage(data.message as string)
				setErrorMessage('')
			}
			if ('error' in data) {
				setErrorMessage(data.error as string)
				setSuccessMessage('')
			}
		}
	}, [data])

	useEffect(() => {
		// Jeśli mamy error z RTK Query / fetch
		if (error && typeof error === 'object') {
			const fetchError = error as FetchBaseQueryError

			if (fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data) {
				setErrorMessage(fetchError.data.message as string)
				setSuccessMessage('')
			}

			if (fetchError.data && typeof fetchError.data === 'object' && 'error' in fetchError.data) {
				setErrorMessage(fetchError.data.error as string)
				setSuccessMessage('')
			}
		}
	}, [error])

	const handleResendVerificationToken = async () => {
		try {
			const res = await resendVerificationToken(email).unwrap()

			if (res) {
				setSuccessMessage(res.message)
				setErrorMessage('')
			}
			setDisabled(true)
			setCountdown(60)
			const interval = setInterval(() => {
				setCountdown(prev => {
					if (prev <= 1) {
						clearInterval(interval)
						setDisabled(false)
						return 0
					}
					return prev - 1
				})
			}, 1000)
		} catch (error) {
			if (error && typeof error === 'object') {
				const fetchError = error as FetchBaseQueryError

				if (fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data) {
					setErrorMessage(fetchError.data.message as string)
					setSuccessMessage('')
				}

				if (fetchError.data && typeof fetchError.data === 'object' && 'error' in fetchError.data) {
					console.log(fetchError.data.error)
					setSuccessMessage('')
					setErrorMessage(fetchError.data.error as string)
				}
			}
		}
	}
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 60000)

			return () => clearTimeout(timer)
		}
	}, [successMessage])

	if (!token) return <Navigate to={'/'} replace />
	if (isLoading) return null
	return (
		<div className={styles.verifyContainer}>
			<div className={styles.verifyWrapper}>
				<h2 className={styles.verifyTitle}>Email Verification</h2>

				{(errorMessage || successMessage) && (
					<>
						{errorMessage && <p className={styles.errorTitle}>Something went wrong...</p>}
						<APIResponseMessage messageType={errorMessage ? 'error' : 'success'} className={styles.apiResponse}>
							{errorMessage ? errorMessage : successMessage}
						</APIResponseMessage>
					</>
				)}

				<FormBtn
					type="button"
					isSubmitting={disabled}
					handleResend={() => handleResendVerificationToken()}
					className={`${styles.resendButton} ${disabled ? styles.disabledResend : ''}`}>
					{disabled ? `Wait ${countdown}` : 'Send Again'}
				</FormBtn>
				<AnchorLink href="/" className={styles.homePageLink}>
					Home Page
				</AnchorLink>

				{!errorMessage && (
					<span className={styles.bottomInfo}>Click on the link in the email to activate your account</span>
				)}
			</div>
		</div>
	)
}

export default VerifyPageTemplate
