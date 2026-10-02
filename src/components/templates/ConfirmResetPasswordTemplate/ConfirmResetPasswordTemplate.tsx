import { GlobalProvider } from '../../../context/globalContext'
import ConfirmResetPassword from '../../organism/ConfirmResetPassword/ConfirmResetPassword'
import styles from './ConfirmResetPasswordTemplate.module.scss'
const ConfirmResetPasswordTemplate = () => {
	return (
		<GlobalProvider>
			<div className={styles.confirmResetPasswordContainer}>
				<ConfirmResetPassword />
			</div>
		</GlobalProvider>
	)
}

export default ConfirmResetPasswordTemplate
