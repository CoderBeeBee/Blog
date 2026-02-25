import { useEffect, useState } from 'react'

import styles from './ResetPassword.module.scss'
import { CheckSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import { useConfirmResetPasswordMutation, useFetchUserProfileQuery } from '../../../slices/api/userApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { Navigate, useLocation } from 'react-router'

import useGlobalContext from '../../../hooks/useGlobalContext'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import z from 'zod'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import RHFInput from '../../atoms/RHFInput/RHFInput'

const schemaNewPassword = z.object({
	newPassword: z.string().trim().min(1, { message: 'Min 8 characters' }),
	confirmPassword: z.string().trim().min(1, { message: 'Min 8 characters' }),
})

type passwordTypes = z.infer<typeof schemaNewPassword>
const ResetPassword = () => {
	const { data } = useFetchUserProfileQuery({})
	const [confirmResetPassowrd] = useConfirmResetPasswordMutation()
	const { signOut } = useGlobalContext()
	const { email = '' } = data ?? {}
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [enabledButton, setEnabledButton] = useState<boolean>(false)

	const { search } = useLocation()
	const query = new URLSearchParams(search)
	const token = query.get('token')

	const methods = useForm<passwordTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(schemaNewPassword),
		defaultValues: {
			newPassword: '',
			confirmPassword: '',
		},
	})

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = methods
	const [newPassword, confirmPassword] = useWatch({
		control,
		name: ['newPassword', 'confirmPassword'],
	})
	const splitEmail = email?.split('@')
	const emailPrefix = splitEmail[0]
	const isEmpty = newPassword.length < 1
	const isEmailInPassword = emailPrefix && newPassword.toLowerCase().includes(emailPrefix.toLowerCase())
	const isValidLength = newPassword.length >= 8
	const isErrorLength = newPassword.length > 0 && newPassword.length < 8

	const onSubmit: SubmitHandler<passwordTypes> = async data => {
		try {
			const { newPassword } = data

			const res = await confirmResetPassowrd({ newPassword, token }).unwrap()

			if (res) {
				setSuccessMessage(res.message)
				reset()
				signOut()
			}
			if (errorMessage) setErrorMessage('')
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occured'

				setErrorMessage(message)
				setSuccessMessage('')
			} else {
				setErrorMessage('An unexpected error has occured')
			}
		}
	}
	useEffect(() => {
		if (newPassword && newPassword.length >= 8 && newPassword === confirmPassword && !isEmailInPassword) {
			setEnabledButton(true)
		} else {
			setEnabledButton(false)
		}
	}, [confirmPassword, isEmailInPassword, newPassword])
	if (!token) return <Navigate to="/" replace />
	return (
		<div className={styles.resetPasswordWrapper}>
			<h3 className={styles.title}>Reset password</h3>

			<FormProvider {...methods}>
				<WrapperBox>
					<p className={styles.boxTitle}>Password</p>
					{(successMessage || errorMessage) && (
						<APIResponseMessage messageType={successMessage ? 'succes' : 'error'}>
							{successMessage ? successMessage : <>{errorMessage}</>}
						</APIResponseMessage>
					)}
					<form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper} aria-busy={isSubmitting}>
						<RHFInput
							type="password"
							id="newPassword"
							name="newPassword"
							isSubmitting={isSubmitting}
							label="New Password"
							styles={styles}>
							<ul className={styles.newPasswordInfo}>
								<li className={`${isValidLength ? styles.highlightLi : isErrorLength ? styles.errorLi : ''}`}>
									<CheckSVG className={styles.checkSVG} />
									<span>Must Be at least 8 characters</span>
								</li>
								<li className={`${isEmailInPassword ? styles.errorLi : !isEmpty ? styles.highlightLi : ''}`}>
									<CheckSVG className={styles.checkSVG} />
									<span>Does not contain your email address</span>
								</li>
							</ul>
						</RHFInput>
						<RHFInput
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							isSubmitting={isSubmitting}
							label="Confirm New Password"
							styles={styles}
						/>

						<div className={styles.formBtns}>
							<FormBtn
								type="submit"
								isSubmitting={!enabledButton}
								className={`${styles.saveChanges} ${enabledButton ? styles.enabledChanges : ''}`}>
								Save Changes
							</FormBtn>
							<AnchorLink href="/account" className={styles.cancelReset}>
								Cancel
							</AnchorLink>
						</div>
					</form>
				</WrapperBox>
			</FormProvider>
		</div>
	)
}

export default ResetPassword
