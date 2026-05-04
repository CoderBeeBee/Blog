import styles from './Password.module.scss'
import { useEffect, useState, type MouseEvent } from 'react'
import { useChangePasswordMutation, useFetchUserProfileQuery } from '../../../slices/api/userApi'
import FormBtn from '../../atoms/FormBtn/FormBtn'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import z from 'zod'
import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { CheckSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'

import RHFInput from '../../atoms/RHFInput/RHFInput'

interface PasswordProps {
	handleAccountPopup: (e: MouseEvent<HTMLButtonElement>) => void
}

const schemaPassword = z.object({
	currentPassword: z.string().trim().min(1, { message: 'Min 8 characters' }),
	newPassword: z.string().trim().min(1, { message: 'Min 8 characters' }),
	confirmPassword: z.string().trim().min(1, { message: 'Min 8 characters' }),
})

type passwordTypes = z.infer<typeof schemaPassword>

const Password = ({ handleAccountPopup }: PasswordProps) => {
	const [enabledButton, setEnabledButton] = useState<boolean>(false)
	const [changePassword] = useChangePasswordMutation()
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [successMessage, setSuccessMessage] = useState<string>('')
	const { data: profileData } = useFetchUserProfileQuery({})

	const { email = '' } = profileData ?? {}

	const methods = useForm<passwordTypes>({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		resolver: zodResolver(schemaPassword),
		defaultValues: {
			currentPassword: '',
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
	const [currentPassword, newPassword, confirmPassword] = useWatch({
		control,
		name: ['currentPassword', 'newPassword', 'confirmPassword'],
	})

	const splitEmail = email?.split('@')
	const emailPrefix = splitEmail[0]
	const isEmpty = newPassword.length < 1
	const isErrorLength = newPassword.length > 0 && newPassword.length < 8
	const isValidLength = newPassword.length >= 8

	const isEmailInPassword = emailPrefix && newPassword.toLowerCase().includes(emailPrefix.toLowerCase())

	const onSubmit: SubmitHandler<passwordTypes> = async data => {
		
		try {
			const { newPassword, currentPassword } = data

			const res = await changePassword({ newPassword, currentPassword }).unwrap()

			if (res) {
				setSuccessMessage(res.message)
				reset()
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
		if (
			currentPassword &&
			newPassword &&
			newPassword.length >= 8 &&
			newPassword === confirmPassword &&
			!isEmailInPassword
		) {
			setEnabledButton(true)
		} else {
			setEnabledButton(false)
		}
	}, [confirmPassword, currentPassword, isEmailInPassword, newPassword])
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				setSuccessMessage('')
			}, 3000)

			return () => clearTimeout(timer)
		}

		if (errorMessage) {
			const timer = setTimeout(() => {
				setErrorMessage('')
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [errorMessage, successMessage])

	return (
		<FormProvider {...methods}>
			<WrapperBox>
				<p className={styles.boxTitle}>Password</p>

				{(successMessage || errorMessage) && (
					<APIResponseMessage messageType={successMessage ? 'succes' : 'error'}>
						{successMessage ? successMessage : <>{errorMessage}</>}
					</APIResponseMessage>
				)}
				<form aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
					<RHFInput
						type="password"
						id="currentPassword"
						name="currentPassword"
						label="Current Password"
						
						isSubmitting={isSubmitting}
					/>
					<button
						id="reset"
						type="button"
						onClick={e => handleAccountPopup(e)}
						aria-label="Reset password"
						className={styles.resetPassword}>
						Reset Password
					</button>

					<RHFInput
						type="password"
						id="newPassword"
						name="newPassword"
						label="New Password"
						
						isSubmitting={isSubmitting}>
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
						label="Confirm Password"
						isSubmitting={isSubmitting}
						
					/>
					<FormBtn
						type="submit"
						isSubmitting={!enabledButton}
						className={`${styles.saveChanges} ${enabledButton ? styles.enabledChanges : ''}`}>
						Save Changes
					</FormBtn>
				</form>
			</WrapperBox>
		</FormProvider>
	)
}

export default Password
