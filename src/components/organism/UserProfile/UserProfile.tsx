import { useState, type MouseEvent } from 'react'
import styles from './UserProfile.module.scss'
import {
	useChangeEmailAddressMutation,
	useFetchUserProfileQuery,
	useResetPasswordMutation,
} from '../../../slices/api/userApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import Profile from '../../modules/Profile/Profile'
import ChangeEmail from '../../modules/ChangeEmail/ChangeEmail'
import Password from '../Password/Password'
import AccountPopup from '../../atoms/AccountPopup/AccountPopup'

import DeleteAccount from '../../modules/DeleteAccount/DeleteAccount'

const UserProfile = () => {
	const [resetPassword] = useResetPasswordMutation()
	const [changeEmailAddress] = useChangeEmailAddressMutation()
	const { data: profileData } = useFetchUserProfileQuery({})

	const { email = '' } = profileData ?? {}
	const [popupErrorMessage, setPopupErrorMessage] = useState<string>('')
	const [popupSuccessMessage, setPopupSuccesMessage] = useState<string>('')
	const [accountPopup, setAccountPopup] = useState<boolean>(false)
	const [isEmail, setIsEmail] = useState<string>('')

	const splitEmail = email?.split('@')
	const emailPrefix = splitEmail[0]
	const splitPrefix = emailPrefix.split('')
	const popupEmail = `${splitPrefix[0]}...${splitPrefix[splitPrefix.length - 1]}@${splitEmail[1]}`

	const handleAccountPopup = (e: MouseEvent<HTMLButtonElement>) => {
		const { id } = e.currentTarget

		setIsEmail(id)
		setAccountPopup(true)

		if (popupErrorMessage) setPopupErrorMessage('')
		if (popupSuccessMessage) setPopupSuccesMessage('')
	}

	const handleSendEmail = async () => {
		try {
			if (isEmail === 'email') {
				const res = await changeEmailAddress({}).unwrap()

				if (res) setPopupSuccesMessage(res.message)
				return
			}
			const res = await resetPassword({}).unwrap()

			if (res) setPopupSuccesMessage(res.message)
			setPopupErrorMessage('')
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError

				const data = fetchError.data

				if (data && typeof data === 'object') {
					const message =
						'error' in data
							? String(data.error)
							: 'message' in data
								? String(data.message)
								: 'An unexpected error has occurred'

					if (message) setPopupErrorMessage(message)
				}
			} else {
				setPopupErrorMessage('An unexpected error has occured')
			}
		}
	}
	return (
		<div className={styles.profileWrapper}>
			<Breadcrumbs />
			<div className={styles.profileBox}>
				<Profile />

				<ChangeEmail email={email} handleAccountPopup={handleAccountPopup} />

				<Password handleAccountPopup={handleAccountPopup} />

				<DeleteAccount />
			</div>

			{accountPopup && (
				<AccountPopup
					popupSuccessMessage={popupSuccessMessage}
					popupErrorMessage={popupErrorMessage}
					popupEmail={popupEmail}
					popupTitle="Confirm Identity"
					setAccountPopup={setAccountPopup}
					handleSendEmail={handleSendEmail}
					setIsEmail={setIsEmail}
				/>
			)}
		</div>
	)
}

export default UserProfile
