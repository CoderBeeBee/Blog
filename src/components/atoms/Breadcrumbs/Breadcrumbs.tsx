import { Link, useLocation } from 'react-router'
import styles from './Breadcrumbs.module.scss'

const Breadcrumbs = () => {
	const { pathname } = useLocation()
	// const url = new URL(window.location.origin)

	const pathnames = pathname.split('/').filter(x => x)
	

	return (
		<div className={styles.breadcrumbsWrapper}>
			{pathnames.map((value, index) => {
				const to = "/" + pathnames.slice(0, index + 1).join('/')
				if (value === 'admin') {
                    
					return (
						<span key={to} className={styles.breadcrumbs}>
							<Link to={to} className={styles.breadcrumbsLink}>Dashboard</Link>
						</span>
					)
				} else {
					return <span key={to} className={styles.breadcrumbs}> / {value}</span>
				}
			})}
		</div>
	)
}

export default Breadcrumbs
