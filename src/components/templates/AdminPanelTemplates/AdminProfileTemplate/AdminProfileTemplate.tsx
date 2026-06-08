import AdminProfile from '../../../organism/AdminProfile/AdminProfile'
import styles from './AdminProfileTemplate.module.scss'


const AdminProfileTemplate = () => {
	return (
		<div className={styles.adminProfileContainer}>
			<AdminProfile/>
		</div>
	)
}

export default AdminProfileTemplate
