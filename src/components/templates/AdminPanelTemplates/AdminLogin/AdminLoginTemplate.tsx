import AdminLogin from '../../../organism/AdminLogin/AdminLogin'
import styles from './AdminLoginTemplate.module.scss'

const AdminLoginTemplate = () => {
	return (
		<div className={styles.adminLoginTemplateContainer}>
			<AdminLogin />
		</div>
	)
}

export default AdminLoginTemplate
