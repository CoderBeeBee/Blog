import { Navigate, useLocation, useNavigate } from 'react-router'
import { useResendVerificationMutation, useVerifyAccountQuery } from '../../../slices/api/userApi'
import styles from './VerifyAccount.module.scss'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import Logo from '../../atoms/logo/Logo'

const VerifyAccount = () => {
	const { search } = useLocation()
	const navigate = useNavigate()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false)
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
			if ('isVerified' in data) {
				setVerificationSuccess(true)
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
			}, 6000)

			return () => clearTimeout(timer)
		}
	}, [successMessage])

	useEffect(()=>{
		if(verificationSuccess) {
			const timer = setTimeout(() => {
				navigate('/')
			}, 5000);

			return () => clearTimeout(timer)
		}
	},[navigate, verificationSuccess])
	if (!token) return <Navigate to={'/'} replace />
	if (isLoading) return null
	return (
		<div className={styles.verifyAccountWrapper}>
			<Logo styles={styles} />
			<h1 className={styles.verifyTitle}>Account Verification</h1>
			{verificationSuccess && (
				<p className={styles.verificationInfo}>
					Good news! Your account has been successfully verified. You can now use all available features.
				</p>
			)}
			{(errorMessage || successMessage) && (
				<>
					{errorMessage && <p className={styles.errorTitle}>Something went wrong...</p>}
					<APIResponseMessage messageType={errorMessage ? 'error' : 'success'} className={styles.apiResponse}>
						{errorMessage ? errorMessage : successMessage}
					</APIResponseMessage>
				</>
			)}

			{!verificationSuccess && (
				<FormBtn
					type="button"
					isSubmitting={disabled}
					handleResend={() => handleResendVerificationToken()}
					className={`${styles.resendButton} ${disabled ? styles.disabledResend : ''}`}>
					{disabled ? `Wait ${countdown}` : 'Send Again'}
				</FormBtn>
			)}

			{errorMessage && (
				<span className={styles.bottomInfo}>Click on the link in the email to activate your account</span>
			)}
		</div>
	)
}

export default VerifyAccount
