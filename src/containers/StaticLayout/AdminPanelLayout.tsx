import { Outlet } from 'react-router'
import SideBar from '../../components/organism/SideBar/SideBar'

import styles from './AdminPanelLayout.module.scss'
import { GlobalProvider } from '../../context/globalContext'
import { adminLinks } from '../../utils/sideBarLinks'

import SideBarLink from '../../components/atoms/SidebarLink/SideBarLink'

import NavPanel from '../../components/atoms/NavPanel/NavPanel'

const AdminPanelLayout = () => {
	return (
		<GlobalProvider>
			<div className={styles.adminPanelLayoutContainer}>
				<NavPanel />
				<div className={styles.adminPanelWrapper}>
					<SideBar>
						{adminLinks.map((data, index) => (
							<SideBarLink key={index} data={data} index={index} />
						))}
					</SideBar>
					<Outlet />
				</div>
			</div>
		</GlobalProvider>
	)
}

export default AdminPanelLayout
