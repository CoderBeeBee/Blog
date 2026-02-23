import styles from './AccountPopup.module.scss'
import CloseButton from '../CloseButton/CloseButton'
import APIResponseMessage from '../APIResponseMessage/APIResponseMessage'
import type { Dispatch, SetStateAction } from 'react'
import FormBtn from '../FormBtn/FormBtn'
interface AccountPopupProps {
	
	popupEmail: string
	handleSendEmail: () => void
	setAccountPopup: Dispatch<SetStateAction<boolean>>
	setIsEmail: Dispatch<SetStateAction<string>>
	popupTitle: string
	popupErrorMessage: string
	popupSuccessMessage: string
}

const AccountPopup = ({
	popupTitle,
	popupErrorMessage,
	popupSuccessMessage,
	popupEmail,
	setIsEmail,
	handleSendEmail,
	setAccountPopup,
}: AccountPopupProps) => {
	const handleAccountPopup = () => {
		setAccountPopup(false)
		setIsEmail('')
	}
	return (
		<div className={styles.popupContainer}>
			<div className={styles.popupWrapper}>
				<p className={styles.popupTitle}>{popupTitle}</p>

				<p className={styles.sendInfo}>
					Send a verification link to <span>{popupEmail}</span>.
				</p>

				{(popupSuccessMessage || popupErrorMessage) && (
					<APIResponseMessage className={styles.popupMessage} messageType={popupSuccessMessage ? 'succes' : 'error'}>
						{popupSuccessMessage ? popupSuccessMessage : <>{popupErrorMessage}</>}
					</APIResponseMessage>
				)}
				<FormBtn
					type="button"
					handleResend={handleSendEmail}
					className={`${styles.popupBtn} ${styles.sendPopupBtn}`}
					ariaLabel="Send button">
					Send Link
				</FormBtn>
				
				<div className={styles.footerLine}></div>
				<FormBtn
					type="button"
					className={`${styles.popupBtn} ${styles.cancelPopupBtn}`}
					onClick={handleAccountPopup}
					aria-label="Cancel button"
					>
					Back
				</FormBtn>
				
				<CloseButton ariaLabel="Close popup button" styles={styles} handleClose={handleAccountPopup} />
			</div>
		</div>
	)
}

export default AccountPopup
