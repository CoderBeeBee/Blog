import Newsletter from '../../../organism/Newsletter/Newsletter'
import styles from './NewsletterTemplate.module.scss'

const NewsletterTemplate = () => {
	return (
		<div className={styles.newsletterContainer}>
			<Newsletter />
		</div>
	)
}

export default NewsletterTemplate
