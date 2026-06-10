import styles from './ProfileTemplate.module.scss'
import UserProfile from '../../../organism/UserProfile/UserProfile'

const ProfileTemplate = () => {
	return (
		<div className={styles.profileTemplateContainer}>
			<UserProfile />
		</div>
	)
}

export default ProfileTemplate
