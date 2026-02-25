import { Outlet } from 'react-router'
import SideBar from '../../components/organism/SideBar/SideBar'
import styles from './AccountLayout.module.scss'

import { GlobalProvider } from '../../context/globalContext'
import { accountLinks } from '../../utils/sideBarLinks'
import SideBarLink from '../../components/atoms/SidebarLink/SideBarLink'

import NavPanel from '../../components/atoms/NavPanel/NavPanel'
const AccountLayout = () => {
	return (
		<GlobalProvider>
			<div className={styles.accountLayoutContainer}>
				<NavPanel />
				<div className={styles.accountPanelWrapper}>
					<SideBar>
						{accountLinks.map((data, index) => (
							<SideBarLink key={index} data={data} index={index} />
						))}
					</SideBar>
					<Outlet />
				</div>
			</div>
		</GlobalProvider>
	)
}

export default AccountLayout
