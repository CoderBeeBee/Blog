import Breadcrumbs from '../../../atoms/Breadcrumbs/Breadcrumbs'
import Statistics from '../../../organism/Statistics/Statistics'
import styles from './DashboardPageTemplate.module.scss'

const DashboardPageTemplate = () => {
	return (
		<div className={styles.dashboardPageTemplateContainer}>
			<Breadcrumbs />
			<Statistics />
		</div>
	)
}

export default DashboardPageTemplate
