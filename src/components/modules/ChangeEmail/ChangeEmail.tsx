import type { MouseEvent } from 'react'
import styles from './ChangeEmail.module.scss'

interface ChangeEmailProps {
	handleAccountPopup: (e: MouseEvent<HTMLButtonElement>) => void
	email: string
}

const ChangeEmail = ({ email, handleAccountPopup }: ChangeEmailProps) => {
	return (
		<div className={styles.changeEmailWrapper}>
			<p className={styles.emailTitle}>Email Address</p>
			<label  className={styles.profileLabel}>
				<input
					type="email"
					
					readOnly
					value={email ?? ''}
					className={` ${styles.profileEmail} ${styles.profileEmailDisabled}`}
				/>
			</label>
			<button id="email" onClick={e => handleAccountPopup(e)} className={styles.changeEmail}>
				Change Email Address
			</button>
		</div>
	)
}

export default ChangeEmail
