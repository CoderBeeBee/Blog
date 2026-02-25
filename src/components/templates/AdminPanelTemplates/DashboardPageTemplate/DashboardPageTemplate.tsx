import Statistics from '../../../organism/Statistics/Statistics'
import styles from './DashboardPageTemplate.module.scss'

const DashboardPageTemplate = () => {
	return (
		<div className={styles.dashboardPageTemplateContainer}>
			<h3 className={styles.dashboardTitle}>Dashboard</h3>
			<Statistics />
		</div>
	)
}

export default DashboardPageTemplate
