import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import styles from './ForgotPassword.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import Logo from '../../atoms/logo/Logo'
import { GlobalProvider } from '../../../context/globalContext'
import { useForgotPasswordMutation } from '../../../slices/api/userApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const forgotSchema = z.object({
	email: z.email({ message: 'Email Address is required' }),
})
type forgotType = z.infer<typeof forgotSchema>

const ForgotPassword = () => {
	const { search } = useLocation()
	const params = new URLSearchParams(search)
	const addressEmail = params.get('email')
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [enabledButton, setEnabledButton] = useState<boolean>(false)
	const [forgotPassword] = useForgotPasswordMutation()
	const methods = useForm<forgotType>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(forgotSchema),
		defaultValues: {
			email: '',
		},
	})

	const {
		control,
		handleSubmit,
		setValue,
		setError,
		reset,
		formState: { isSubmitting, errors },
	} = methods

	const [email] = useWatch({ control, name: ['email'] })

	const onSubmit: SubmitHandler<forgotType> = async data => {
		try {
			if (!data) return

			const res = await forgotPassword(data).unwrap()

			if (res) setSuccessMessage(res.message)
			reset()
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const messageError =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occured'
				setError('root', { message: messageError })
			} else {
				setError('root', { message: 'An unexpected error has occured' })
			}
		}
	}

	useEffect(() => {
		if (addressEmail) setValue('email', addressEmail)
	}, [addressEmail, setValue])

	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 3000)

			return () => clearTimeout(timer)
		}
		if (errors.root?.message) {
			const timer = setTimeout(() => {
				setError('root', { message: '' })
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [errors.root?.message, setError, successMessage])
	useEffect(() => {
		if (email) {
			setEnabledButton(true)
		} else {
			setEnabledButton(false)
		}
	}, [email])
	return (
		<GlobalProvider>
			<FormProvider {...methods}>
				<div className={styles.forgotPasswordWrapper}>
					<Logo styles={styles} />
					<h1>Reset your password</h1>
					<p>
						To begin the password change process, enter your email address. You will receive a link with instructions on
						how to change your password at the address you provided.
					</p>
					<form aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
						<RHFInput type="email" name="email" id="email" label="Email Address" tip={false} placeholder='Enter your email address' />

						{(errors.root?.message || successMessage) && (
							<APIResponseMessage
								messageType={`${successMessage ? 'success' : 'error'}`}
								className={styles.apiResponse}>
								{errors.root?.message ? errors.root.message : successMessage}
							</APIResponseMessage>
						)}
						<FormBtn
							type="submit"
							className={`${styles.resetButton} ${enabledButton && !isSubmitting ? styles.enableButton : ''}`}
							isSubmitting={isSubmitting || !enabledButton}>
							{isSubmitting ? 'Submitting...' : 'Reset'}
						</FormBtn>
					</form>
				</div>
			</FormProvider>
		</GlobalProvider>
	)
}

export default ForgotPassword
