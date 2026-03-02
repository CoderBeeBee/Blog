import Subscribers from '../../../organism/Subscribers/Subscribers'
import styles from './SubscribersTemplate.module.scss'

const SubscribersTemplate = () => {
	return (
		<div className={styles.subscribersContainer}>
			<Subscribers />
		</div>
	)
}

export default SubscribersTemplate
