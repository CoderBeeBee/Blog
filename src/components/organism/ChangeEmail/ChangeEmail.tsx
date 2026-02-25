import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import APIResponseMessage from '../../atoms/APIResponseMessage/APIResponseMessage'
import FormBtn from '../../atoms/FormBtn/FormBtn'

import styles from './ChangeEmail.module.scss'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useConfirmNewEmailMutation } from '../../../slices/api/userApi'
import useDebounce from '../../../hooks/useDebounce'
import { Navigate, useLocation } from 'react-router'
import useGlobalContext from '../../../hooks/useGlobalContext'
import WrapperBox from '../../atoms/WrapperBox/WrapperBox'
import AccountInputBox from '../../modules/AccountInputBox/AccountInputBox'
const ChangeEmail = () => {
	const [newEmail, setNewEmail] = useState<string>('')
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [enabledButton, setEnabledButton] = useState<boolean>(false)
	const [confirmNewEmail, { isLoading }] = useConfirmNewEmailMutation()
	const { signOut } = useGlobalContext()
	const debounce = useDebounce(newEmail, 1000)

	const { search } = useLocation()
	const query = new URLSearchParams(search)
	const token = query.get('token')

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget

		setNewEmail(value)
	}

	useEffect(() => {
		const regex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', 'i')

		const checkEmail = regex.test(debounce)
		if (debounce && !checkEmail) {
			setErrorMessage('Invalid email address')
		} else {
			setErrorMessage('')
		}
	}, [debounce])
	useEffect(() => {
		if (newEmail.length > 1) {
			setEnabledButton(true)

			return
		}

		setEnabledButton(false)
	}, [newEmail.length])

	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => {
				setErrorMessage('')
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [errorMessage])

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		try {
			if (!newEmail) return

			const res = await confirmNewEmail({ newEmail, token }).unwrap()
			if (res) {
				setSuccessMessage(res.message)
				setNewEmail('')

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

	if (!token) return <Navigate to="/" replace />

	return (
		<div className={styles.changeEmailWrapper}>
			<h3 className={styles.title}>Change Email Address</h3>

			<WrapperBox>
				{(successMessage || errorMessage) && (
					<APIResponseMessage messageType={successMessage ? 'succes' : 'error'}>
						{successMessage ? successMessage : <>{errorMessage}</>}
					</APIResponseMessage>
				)}
				<form onSubmit={e => handleSubmit(e)} className={styles.formWrapper} aria-busy={isLoading}>
					<AccountInputBox
						onChangeInput={e => onChangeInput(e)}
						value={newEmail}
						id="newEmail"
						label="Confirm New Email Address"
						type="email"
						isSubmitting={isLoading}
						placeholder="new@example.com"
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
		</div>
	)
}

export default ChangeEmail
