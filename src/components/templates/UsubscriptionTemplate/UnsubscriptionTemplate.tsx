import { useForm, type SubmitHandler } from 'react-hook-form'
import { useConfirmUnsubscribeQuery, useUnsubscribeMutation } from '../../../slices/api/subscriptionApi'
import styles from './UnsubscriptionTemplate.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { useEffect, useState } from 'react'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useLocation, useNavigate } from 'react-router'

const unsubscriptionSchema = z.object({
	email: z.email(),
})
type unsubscriptionTypes = z.infer<typeof unsubscriptionSchema>
const UnsubscriptionTemplate = () => {
	const [successUnsubscription, setSuccessUnsubscription] = useState<string>('')
	const navigate = useNavigate()
	const [unsubscribe] = useUnsubscribeMutation()
	const { search } = useLocation()
	const params = new URLSearchParams(search)
	const token = params.get('token')

	const { data, error } = useConfirmUnsubscribeQuery({ token })

	const {
		register,
		handleSubmit,
		setError,
		reset,
		clearErrors,
		formState: { isSubmitting, errors },
	} = useForm<unsubscriptionTypes>({
		mode: 'onSubmit',
		resolver: zodResolver(unsubscriptionSchema),
		defaultValues: {
			email: '',
		},
	})
	const onSubmit: SubmitHandler<unsubscriptionTypes> = async data => {
		try {
			if (!data) return

			const res = await unsubscribe({ email: data.email }).unwrap()

			if (res) {
				setSuccessUnsubscription(res.message)
				reset()

				setTimeout(() => {
					navigate('/')
				}, 4000)
			}
			if (errors) clearErrors()
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'error' in fetchError.data
						? (fetchError.data.error as string)
						: 'An unexpected error has occured'
				setError('root', { message })
			} else {
				setError('root', { message: 'An unexpected error has occured' })
			}
		}
	}
	useEffect(() => {
		if (successUnsubscription) {
			const timer = setTimeout(() => {
				setSuccessUnsubscription('')
			}, 4000)

			return () => clearTimeout(timer)
		}
	}, [successUnsubscription])

	useEffect(() => {
		if (data) {
			setSuccessUnsubscription(data.message)

			const timer = setTimeout(() => {
				navigate('/')
			}, 4000)

			return () => clearTimeout(timer)
		}

		if (error) {
			const fetchError = error as FetchBaseQueryError

			const message =
				fetchError?.data && typeof fetchError.data === 'object' && 'error' in fetchError.data
					? (fetchError.data.error as string)
					: 'An unexpected error has occurred'

			setError('root', { message })
		}
	}, [data, error, navigate, setError])

	return (
		<div className={styles.unsubscriptionContainer}>
			<div className={styles.unsubscriptionWrapper}>
				<h1 className={styles.unsubscriptionTitle}>Unsubscribe</h1>

				<p className={styles.unsubscriptionText}>Confirm your email address to unsubscribe</p>
				<div className={styles.unsubscriptionFormWrapper}>
					<form className={styles.formWrapper} aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
						<input
							{...register('email')}
							type="email"
							name="email"
							id="email"
							aria-label="Email"
							placeholder="Your email Address"
							readOnly={isSubmitting}
							className={styles.unsubscriptionInput}
						/>
						{errors.email && <span className={styles.formError}>{errors.email?.message}</span>}

						{(errors.root?.message || successUnsubscription) && (
							<APIResponseMessage
								messageType={successUnsubscription ? 'success' : 'error'}
								className={styles.apiResponse}>
								{errors.root?.message ? errors.root?.message : successUnsubscription}
							</APIResponseMessage>
						)}

						<FormBtn type="submit" isSubmitting={isSubmitting} className={styles.unsubscriptionButton}>
							Unsubscribe
						</FormBtn>
					</form>
				</div>
				<AnchorLink href="/" className={styles.homePageLink}>
					Home Page
				</AnchorLink>
			</div>
		</div>
	)
}

export default UnsubscriptionTemplate
