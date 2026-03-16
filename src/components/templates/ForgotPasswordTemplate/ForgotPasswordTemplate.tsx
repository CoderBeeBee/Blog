import ForgotPassword from '../../organism/ForgotPassword/ForgotPassword'
import styles from './ForgotPasswordTemplate.module.scss'

const ForgotPasswordTemplate = () => {
	return (
		<div className={styles.forgotPasswordContainer}>
			<ForgotPassword />
		</div>
	)
}

export default ForgotPasswordTemplate
