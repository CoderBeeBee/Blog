import { useState, type MouseEvent } from 'react'
import {
	useChangeEmailAddressMutation,
	useFetchUserProfileQuery,
	useResetPasswordMutation,
} from '../../../slices/api/userApi'
import styles from './AdminProfile.module.scss'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import Profile from '../../modules/Profile/Profile'

import Password from '../Password/Password'
import AccountPopup from '../../atoms/AccountPopup/AccountPopup'
import ChangeEmail from '../../modules/ChangeEmail/ChangeEmail'
const AdminProfile = () => {
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
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occured'

				if (message) setPopupErrorMessage(message)
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

				<ChangeEmail email={email} handleAccountPopup={handleAccountPopup}/>

				<Password handleAccountPopup={handleAccountPopup} />
			</div>
			{/* <p className={styles.boxTitle}>Delete Account</p>
					<p className={styles.deleteText}>
						By clicking on the button, you will proceed to the account deletion process. You will be able to recover
						your account within 30 days from the date of confirmation of deletion.
					</p>

					<AnchorLink href="/account/delete" ariaLabel="Delete account" className={styles.deleteAccount}>
						Delete Account
					</AnchorLink> */}

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

export default AdminProfile
