import { Navigate, useLocation, useNavigate } from 'react-router'
import styles from './SubscriptionTemplate.module.scss'
import { useVerifySubscriptionQuery } from '../../../slices/api/subscriptionApi'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { useEffect, useState } from 'react'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const SubscribctionTemplate = () => {
	const { search } = useLocation()
	const params = new URLSearchParams(search)
	const token = params.get('token')
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const { data, error } = useVerifySubscriptionQuery({ token })
	const navigate = useNavigate()
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

	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				navigate('/')
			}, 5000)

			return () => clearTimeout(timer)
		}
	}, [navigate, successMessage])

	if (!token) return <Navigate to={'/'} replace />
	return (
		<div className={styles.subscriptionContainer}>
			<div className={styles.subscriptionWrapper}>
				<h1 className={styles.subscriptionTitle}>Subscription Verification</h1>

				{(errorMessage || successMessage) && (
					<APIResponseMessage messageType={errorMessage ? 'error' : 'success'} className={styles.apiResponse}>
						{errorMessage ? errorMessage : successMessage}
					</APIResponseMessage>
				)}

				<AnchorLink href="/" className={styles.homePageLink}>
					Home Page
				</AnchorLink>
				{!data?.isVerified && (
					<span className={styles.subscriptionInfo}>
						Enter your email address in the subscription form to check if you are already subscribed.
					</span>
				)}
			</div>
		</div>
	)
}

export default SubscribctionTemplate
