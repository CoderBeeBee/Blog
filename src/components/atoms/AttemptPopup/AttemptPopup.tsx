import type { Dispatch, SetStateAction } from 'react'
import styles from './AttemptPopup.module.scss'
import FormBtn from '../FormBtn/FormBtn'
import CloseButton from '../CloseButton/CloseButton'
import type { attemptsProps, auditlogsProps } from '../../../types/types'
import longDateConverter from '../../../hooks/longDateConverter'

interface AttemptPopupProps {
	setOpenPopup: Dispatch<SetStateAction<boolean>>
	attemptData?: attemptsProps | null
	auditlogData?: auditlogsProps | null
}

const AttemptPopup = ({ setOpenPopup, attemptData, auditlogData }: AttemptPopupProps) => {
	const handleAccountPopup = () => {
		setOpenPopup(false)
	}

	const changes = attemptData?.metadata ? attemptData?.metadata : auditlogData?.changes
	const createdAt = attemptData?.createdAt ? attemptData?.createdAt : auditlogData?.createdAt
	const location = attemptData?.location ? attemptData?.location : auditlogData?.metadata?.location
	const device = attemptData?.userAgent.device ? attemptData?.userAgent.device : auditlogData?.metadata?.device
	const os = attemptData?.userAgent.os ? attemptData?.userAgent.os : auditlogData?.metadata?.os
	const browser = attemptData?.userAgent.browser ? attemptData?.userAgent.browser : auditlogData?.metadata?.browser
	if (!createdAt) return null

	const date = new Date(createdAt).toLocaleDateString(...longDateConverter())
	return (
		<div className={styles.attemptPopupWrapper}>
			<div className={styles.popupWrapper}>
				<p className={styles.popupTitle}>Data</p>
				<ul className={styles.popupData}>
					{Object.entries(changes || {}).map(([key, value]) => (
						<li key={key} className={styles.dataLi}>
							{key}: {String(value)}
						</li>
					))}
					<li className={styles.dataLi}>Created at : {date}</li>
					<li className={styles.dataLi}>Location : {location}</li>
					<li className={styles.dataLi}>Device: {device}</li>
					<li className={styles.dataLi}>OS: {os}</li>
					<li className={styles.dataLi}>Browser: {browser}</li>
				</ul>
				<div className={styles.footerLine}></div>
				<FormBtn
					type="button"
					className={`${styles.popupBtn} ${styles.cancelPopupBtn}`}
					onClick={handleAccountPopup}
					aria-label="Cancel button">
					Back
				</FormBtn>

				<CloseButton ariaLabel="Close popup button" styles={styles} handleClose={handleAccountPopup} />
			</div>
		</div>
	)
}

export default AttemptPopup
