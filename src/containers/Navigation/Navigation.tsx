import styles from './Nav.module.scss'
import Logo from '../../components/atoms/logo/Logo'
import useWindowSize from '../../hooks/useWindowSize'
import DesktopNav from './desktopNav/DesktopNav'
import { dataNavigation } from './dataNavigation/dataNavigation'
import MobileNav from './mobileNav/MobileNav'
import SearchButton from '../../components/atoms/SearchButton/SearchButton'
import SearchContainer from '../../components/organism/SearchContainer/SearchContainer'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { useEffect } from 'react'
import MenuIcon from '../../components/atoms/MenuIcon/MenuIcon'
import ControlPanel from '../../components/organism/ControlPanel/ControlPanel'
import useGlobalContext from '../../hooks/useGlobalContext'
import { useLocation } from 'react-router'
import { useFetchAllCategoriesQuery } from '../../slices/api/categoriesApi'

const Navigation = () => {
	const size = useWindowSize()
	const { pathname } = useLocation()

	const { navRef } = useGlobalContext()

	const { isOpen } = useSelector((state: RootState) => state.theme)
	useEffect(() => {
		const handleScroll = () => {
			if (pathname === '/') {
				if (window.scrollY >= 200) {
					navRef.current?.classList.add(styles.bgcNavBlack)
				} else {
					navRef.current?.classList.remove(styles.bgcNavBlack)
				}
			}
		}

		document.addEventListener('scroll', handleScroll)

		return () => {
			document.removeEventListener('scroll', handleScroll)
		}
	}, [navRef, pathname])

	useEffect(() => {
		if (pathname !== '/') {
			navRef.current?.classList.add(styles.bgcNavBlack)
		} else {
			navRef.current?.classList.remove(styles.bgcNavBlack)
		}
	}, [pathname, navRef])

	const { data } = useFetchAllCategoriesQuery()

	if (!data) return
	const newDataMenu = dataNavigation.map(item => {
		if (item.title === 'Categories') {
			if (data && data?.length > 0) return { ...item, children: data }

			return item
		}

		return item
	})

	return (
		<nav ref={navRef} className={styles.navContainer}>
			<Logo styles={styles} />
			{size.width > 900 ? <DesktopNav navRef={navRef} dataMenu={newDataMenu} /> : <MobileNav dataMenu={newDataMenu} />}
			<div className={styles.navPanel}>
				<SearchButton />
				{size.width > 900 ? <ControlPanel index={0} styles={styles} /> : <MenuIcon />}
			</div>

			{isOpen && <SearchContainer isOpen={isOpen} />}
		</nav>
	)
}

export default Navigation
