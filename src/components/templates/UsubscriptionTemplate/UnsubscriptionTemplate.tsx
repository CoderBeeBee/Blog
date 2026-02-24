import { useConfirmUnsubscribeQuery } from '../../../slices/api/subscriptionApi'
import styles from './UnsubscriptionTemplate.module.scss'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { useEffect } from 'react'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import { Navigate, useLocation, useNavigate } from 'react-router'

const UnsubscriptionTemplate = () => {
	const navigate = useNavigate()
	const { search } = useLocation()
	const params = new URLSearchParams(search)
	const token = params.get('token')

	const { data, error,isLoading } = useConfirmUnsubscribeQuery({ token }, { skip: !token })
	
	useEffect(() => {
		if (data) {
			const timer = setTimeout(() => {
				navigate('/')
			}, 4000)

			return () => clearTimeout(timer)
		}
	}, [data, navigate])

	if (!token) return <Navigate to={'/'} replace />
	if (error) return <Navigate to={'/'} replace />
	if (isLoading) return null
	return (
		<div className={styles.unsubscriptionContainer}>
			<div className={styles.unsubscriptionWrapper}>
				<h1 className={styles.unsubscriptionTitle}>Success</h1>

				{data?.message && (
					<APIResponseMessage messageType="success" className={styles.apiResponse}>
						{data?.message}
					</APIResponseMessage>
				)}

				<AnchorLink href="/" className={styles.homePageLink}>
					Home Page
				</AnchorLink>
			</div>
		</div>
	)
}

export default UnsubscriptionTemplate
