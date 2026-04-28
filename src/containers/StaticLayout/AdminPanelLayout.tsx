import { Outlet, useLocation } from 'react-router'
import SideBar from '../../components/organism/SideBar/SideBar'

import styles from './AdminPanelLayout.module.scss'
import { GlobalProvider } from '../../context/globalContext'
import { adminLinks } from '../../utils/sideBarLinks'

import SideBarLink from '../../components/atoms/SidebarLink/SideBarLink'

import AdminNavigation from '../Navigation/AdminNavigation/AdminNavigation'
import { useEffect, useState } from 'react'

const AdminPanelLayout = () => {
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
		const ind = adminLinks.findIndex(i => pathname.split('-').join('').includes(i.title.toLowerCase().split(' ').join('')))

		if (ind) setActiveDashboardIndex(ind)
	}, [pathname])

	return (
		<GlobalProvider>
			<div className={styles.adminPanelLayoutContainer}>
				<AdminNavigation />
				<div className={styles.adminPanelWrapper}>
					<SideBar>
						{adminLinks.map((data, index) => (
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

export default AdminPanelLayout
