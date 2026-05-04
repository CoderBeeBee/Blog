import { Outlet, useLocation } from 'react-router'
import SideBar from '../../components/organism/SideBar/SideBar'
import styles from './AccountLayout.module.scss'

import { GlobalProvider } from '../../context/globalContext'
import { accountLinks } from '../../utils/sideBarLinks'
import SideBarLink from '../../components/atoms/SidebarLink/SideBarLink'
import UserNavigation from '../../components/atoms/UserNavigation/UserNavigation'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { useEffect, useState } from 'react'

const AccountLayout = () => {
	const { role } = useSelector((state: RootState) => state.auth)
	const { pathname } = useLocation()
		const [activeDashboardIndex, setActiveDashboardIndex] = useState<number | null>(null)
		const expandCollapseDashboardDropdown = (index: number) => {
			if (typeof index !== 'number') return
	
			if (activeDashboardIndex === index) {
				setActiveDashboardIndex(null)
			} else {
				setActiveDashboardIndex(index)
			}
		}
		
		useEffect(() => {
			// const ind = adminLinks.findIndex(i => pathname.includes(i.title.toLowerCase()))
			const ind = accountLinks.findIndex(i => pathname.split('-').join('').includes(i.title.toLowerCase().split(' ').join('')))
	
			if (ind) setActiveDashboardIndex(ind)
		}, [pathname])
	return (
		<GlobalProvider>
			<div className={styles.accountLayoutContainer}>
				{role === 'User' && <UserNavigation />}
				<div className={styles.accountPanelWrapper}>
					<SideBar>
						{accountLinks.map((data, index) => (
							<SideBarLink
								key={index}
								data={data}
								index={index}
								activeDashboardIndex={activeDashboardIndex}
								expandCollapseDashboardDropdown={expandCollapseDashboardDropdown}
							/>
						))}
					</SideBar>
					<Outlet />
				</div>
			</div>
		</GlobalProvider>
	)
}

export default AccountLayout
