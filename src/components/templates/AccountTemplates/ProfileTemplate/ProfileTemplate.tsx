import styles from './ProfileTemplate.module.scss'
import { useState, type MouseEvent } from 'react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import {
	useChangeEmailAddressMutation,
	useFetchUserProfileQuery,
	useResetPasswordMutation,
} from '../../../../slices/api/userApi'

import AccountPopup from '../../../atoms/AccountPopup/AccountPopup'

import AnchorLink from '../../../atoms/AnchorLink/AnchorLink'

import WrapperBox from '../../../atoms/WrapperBox/WrapperBox'
import Profile from '../../../organism/Profile/Profile'
import Password from '../../../organism/Password/Password'

const ProfileTemplate = () => {
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
		<div className={styles.profileTemplateContainer}>
			<h2 className={styles.title}>Profile Info</h2>
			<div className={styles.profileWrapper}>
				<Profile />
				<WrapperBox>
					<p className={styles.boxTitle}>Email Address</p>
					<label htmlFor="email" className={styles.profileLabel}>
						<input
							type="email"
							id="email"
							readOnly
							value={email ?? ''}
							className={` ${styles.profileEmail} ${styles.profileEmailDisabled}`}
						/>
					</label>
					<button id="email" onClick={e => handleAccountPopup(e)} className={styles.changeEmail}>
						Change Email Address
					</button>
				</WrapperBox>
				<Password handleAccountPopup={handleAccountPopup} />
				<WrapperBox>
					<p className={styles.boxTitle}>Delete Account</p>
					<p className={styles.deleteText}>
						By clicking on the button, you will proceed to the account deletion process. You will be able to recover
						your account within 30 days from the date of confirmation of deletion.
					</p>

					<AnchorLink href="/account/delete" ariaLabel="Delete account" className={styles.deleteAccount}>
						Delete Account
					</AnchorLink>
				</WrapperBox>
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

export default ProfileTemplate
