import styles from './ConfirmResetPassword.module.scss'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { GlobalProvider } from '../../../context/globalContext'
import Logo from '../../atoms/logo/Logo'
import RHFInput from '../../atoms/RHFInput/RHFInput'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useConfirmResetPasswordMutation } from '../../../slices/api/userApi'
import { Navigate, useLocation } from 'react-router'
import useGlobalContext from '../../../hooks/useGlobalContext'

const newPasswordSchema = z.object({
	newPassword: z.string().trim().min(8, { message: 'Password must include min 8 characters' }),
	confirmNewPassword: z.string().trim().min(8, { message: 'Password must include min 8 characters' }),
})
type newPasswordType = z.infer<typeof newPasswordSchema>
const ConfirmResetPassword = () => {
	const [successMessage, setSuccessMessage] = useState<string>('')
	const { signOut } = useGlobalContext()

	const { search } = useLocation()
	const params = new URLSearchParams(search)
	const token = params.get('token')
	const [enabledButton, setEnabledButton] = useState<boolean>(false)
	const [confirmResetPassword] = useConfirmResetPasswordMutation()
	const methods = useForm<newPasswordType>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			newPassword: '',
			confirmNewPassword: '',
		},
	})

	const {
		control,
		handleSubmit,

		setError,
		reset,
		formState: { isSubmitting, errors },
	} = methods
	const [newPassword, confirmNewPassword] = useWatch({
		control,
		name: ['newPassword', 'confirmNewPassword'],
	})

	const onSubmit: SubmitHandler<newPasswordType> = async data => {
		try {
			if (!data) return
			const { newPassword } = data
			const res = await confirmResetPassword({ newPassword, token }).unwrap()

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
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')

				signOut()
			}, 3000)

			return () => clearTimeout(timer)
		}
		if (errors.root?.message) {
			const timer = setTimeout(() => {
				setError('root', { message: '' })
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [errors.root?.message, setError, signOut, successMessage])

	useEffect(() => {
		if (newPassword && newPassword.length >= 8 && newPassword === confirmNewPassword) {
			setEnabledButton(true)
		} else {
			setEnabledButton(false)
		}
	}, [confirmNewPassword, newPassword])

	if (!token) return <Navigate to="/" replace />
	return (
		<GlobalProvider>
			<FormProvider {...methods}>
				<div className={styles.confirmResetPasswordWrapper}>
					<Logo styles={styles} />
					<h1>Enter your new password</h1>

					<form aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
						<RHFInput
							type="password"
							id="newPassword"
							name="newPassword"
							isSubmitting={isSubmitting}
							label="New Password"
					
						/>
						<RHFInput
							type="password"
							id="confirmNewPassword"
							name="confirmNewPassword"
							isSubmitting={isSubmitting}
							label="Confirm New Password"
							
						/>

						{(errors.root?.message || successMessage) && (
							<APIResponseMessage
								messageType={`${successMessage ? 'success' : 'error'}`}
								className={styles.apiResponse}>
								{errors.root?.message ? errors.root.message : successMessage}
							</APIResponseMessage>
						)}
						<FormBtn
							type="submit"
							className={`${styles.confirmButton} ${enabledButton && !isSubmitting ? styles.enableButton : ''}`}
							isSubmitting={isSubmitting || !enabledButton}>
							{isSubmitting ? 'Confirmation...' : 'Confirm'}
						</FormBtn>
					</form>
				</div>
			</FormProvider>
		</GlobalProvider>
	)
}

export default ConfirmResetPassword
