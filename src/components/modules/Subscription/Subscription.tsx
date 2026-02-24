import z from 'zod'
import styles from './Subscription.module.scss'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { useEffect, useState } from 'react'
import { useSubscriptionMutation } from '../../../slices/api/subscriptionApi'

const subscriptionSchema = z.object({
	email: z.email(),
})
type subscriptionTypes = z.infer<typeof subscriptionSchema>

const Subscription = () => {
	const [successSubscription, setSuccessSubscription] = useState<string>('')
	const [subscribe] = useSubscriptionMutation()

	const {
		register,
		handleSubmit,
		setError,
		reset,
		clearErrors,
		formState: { isSubmitting, errors },
	} = useForm<subscriptionTypes>({
		mode: 'onSubmit',
		resolver: zodResolver(subscriptionSchema),
		defaultValues: {
			email: '',
		},
	})
	const onSubmit: SubmitHandler<subscriptionTypes> = async data => {
		try {
			const res = await subscribe({ email: data.email }).unwrap()

			if (res) {
				setSuccessSubscription(res.message)
				reset({ email: '' })
			}
			if (errors) clearErrors()
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError

				if (fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data) {
					setError('root', { message: fetchError.data.message as string })
				}
				if (fetchError.data && typeof fetchError.data === 'object' && 'error' in fetchError.data) {
					setError('root', { message: fetchError.data.error as string })
				}
			} else {
				setError('root', { message: 'An unexpected error has occured' })
			}
		}
	}
	useEffect(() => {
		if (successSubscription) {
			const timer = setTimeout(() => {
				setSuccessSubscription('')
			}, 5000)

			return () => clearTimeout(timer)
		}

		if (errors.root?.message) {
			const timer = setTimeout(() => {
				clearErrors('root')
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [clearErrors, errors.root?.message, successSubscription])
	return (
		<div className={`${styles.subscriptionWrapper} ${styles.column}`}>
			<h2 className={styles.footerTitle}>Sign Up For Newsletter</h2>
			<p className={styles.subscriptionText}>Signup to get updates on articles, interviews and events.</p>
			<div className={styles.subscriptionFormWrapper}>
				<form className={styles.formWrapper} aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
					<input
						{...register('email')}
						type="email"
						name="email"
						id="email"
						placeholder="Your email Address"
						readOnly={isSubmitting}
						className={styles.subscriptionInput}
					/>
					{(errors.root?.message || errors.email?.message || successSubscription) && (
						<div className={successSubscription ? styles.subscriptionSuccess : styles.subscriptionError}>
							{errors.root?.message || errors.email?.message || successSubscription}
						</div>
					)}
					<button type="submit" disabled={isSubmitting} className={styles.subscriptionButton}>
						Subscribe
					</button>
				</form>
			</div>
		</div>
	)
}

export default Subscription
