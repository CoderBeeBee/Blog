import { Outlet } from 'react-router'
import SideBar from '../../components/organism/SideBar/SideBar'
import styles from './AccountLayout.module.scss'

import { GlobalProvider } from '../../context/globalContext'
import { accountLinks } from '../../utils/sideBarLinks'
import SideBarLink from '../../components/atoms/SidebarLink/SideBarLink'
import UserNavigation from '../../components/atoms/UserNavigation/UserNavigation'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'

const AccountLayout = () => {
	const { role } = useSelector((state: RootState) => state.auth)
	return (
		<GlobalProvider>
			<div className={styles.accountLayoutContainer}>
				{role === 'User' && <UserNavigation />}
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
