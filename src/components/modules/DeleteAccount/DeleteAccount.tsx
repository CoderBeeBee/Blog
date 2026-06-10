import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import styles from './DeleteAccount.module.scss'

const DeleteAccount = () => {
	return (
		<div className={styles.deleteAccountWrapper}>
			<p className={styles.title}>Delete Account</p>
			<p className={styles.deleteText}>
				By clicking on the button, you will proceed to the account deletion process. You will be able to recover your
				account within 30 days from the date of confirmation of deletion.
			</p>

			<AnchorLink href="/account/delete" ariaLabel="Delete account" className={styles.deleteAccount}>
				Delete Account
			</AnchorLink>
		</div>
	)
}

export default DeleteAccount
