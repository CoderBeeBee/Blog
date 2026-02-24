import APIResponseMessage from '../APIResponseMessage/APIResponseMessage'
import CloseButton from '../CloseButton/CloseButton'
import FormBtn from '../FormBtn/FormBtn'
import styles from './Popup.module.scss'
import { type ReactNode, type RefObject } from 'react'
interface PopupProps {
	children: ReactNode
	popupRef: RefObject<HTMLDivElement | null>
	handleClosePopup: () => void
	popUpMessage: string
	handleDelete: () => void
}
const Popup = ({ children, popupRef, popUpMessage, handleClosePopup, handleDelete }: PopupProps) => {
	return (
		<div ref={popupRef} className={styles.popupContainer}>
			<div className={styles.popupWrapper}>
				<p className={styles.popupTitle}>Confirm Deletion</p>
				{children}
				<div className={styles.popupFooter}>
					{popUpMessage && (
						<APIResponseMessage messageType={popUpMessage ? 'success' : 'error'}>{popUpMessage}</APIResponseMessage>
					)}
					<FormBtn
						type="button"
						aria-label={popUpMessage ? 'Close button' : 'Delete button'}
						className={`${styles.popupBtn} ${popUpMessage ? styles.closePopupBtn : styles.deleteBtn}`}
						onClick={popUpMessage ? handleClosePopup : handleDelete}>
						{popUpMessage ? 'Close ' : 'Delete'}
					</FormBtn>
				</div>
				<CloseButton ariaLabel="Close popup button" styles={styles} handleClose={handleClosePopup} />
			</div>
		</div>
	)
}

export default Popup
