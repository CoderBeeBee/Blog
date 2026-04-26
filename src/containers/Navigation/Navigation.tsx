import styles from './Navigation.module.scss'
import Logo from '../../components/atoms/logo/Logo'
import useWindowSize from '../../hooks/useWindowSize'
import DesktopNav from './desktopNav/DesktopNav'
import { dataNavigation } from './dataNavigation/dataNavigation'
import MobileNav from './mobileNav/MobileNav'
import SearchButton from '../../components/atoms/SearchButton/SearchButton'
import SearchContainer from '../../components/organism/SearchContainer/SearchContainer'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { useEffect, useState } from 'react'
import MenuIcon from '../../components/atoms/MenuIcon/MenuIcon'
import ControlPanel from '../../components/organism/ControlPanel/ControlPanel'
import useGlobalContext from '../../hooks/useGlobalContext'
import { useLocation } from 'react-router'
import { useFetchAllCategoriesQuery } from '../../slices/api/categoriesApi'
import AdminSystemNavigation from './AdminSystemNavigation/AdminSystemNavigation'
import type { CategoryProps } from '../../types/types'

const Navigation = () => {
	const { widthGreater900 } = useWindowSize()
	const { pathname } = useLocation()
	const { navRef } = useGlobalContext()
	const { isOpen } = useSelector((state: RootState) => state.theme)
	const { role, isLogged } = useSelector((state: RootState) => state.auth)
	const isNavBgcBlack = pathname !== '/'
	const { data: categories } = useFetchAllCategoriesQuery()
	const [roots, setRoots] = useState<CategoryProps[]>([])

	useEffect(() => {
		if (!categories) return

		const map = new Map<string, CategoryProps>()
		const roots: CategoryProps[] = []

		categories.forEach(item => map.set(item._id, { ...item, children: [] }))

		categories.forEach((cat: CategoryProps) => {
			if (cat.parent) {
				const parent = map.get(cat.parent)

				if (parent) {
					parent.children?.push(map.get(cat._id)!)
				}
			} else {
				roots.push(map.get(cat._id)!)
			}
		})
		setRoots([...roots].sort((a, b) => a.name.localeCompare(b.name)))
	}, [categories])

	
	const newDataMenu = dataNavigation.map(item => {
		if (item.title === 'Categories') {
			if (categories && categories?.length > 0) return { ...item, children: categories?.length ? roots : [] }
			return item
		}

		return item
	})

	useEffect(() => {
		const handleScroll = () => {
			if (!isNavBgcBlack) {
				if (window.scrollY >= 200) {
					navRef.current?.classList.add(styles.navBgcBlack)
				} else {
					navRef.current?.classList.remove(styles.navBgcBlack)
				}
			}
		}

		document.addEventListener('scroll', handleScroll)

		return () => {
			document.removeEventListener('scroll', handleScroll)
		}
	}, [isNavBgcBlack, navRef])

	if (!categories) return

	return (
		<nav className={styles.navigationContainer}>
			{role !== 'User' && isLogged && <AdminSystemNavigation />}
			<div ref={navRef} className={`${styles.websiteNavigation} ${isNavBgcBlack ? styles.navBgcBlack : ''}`}>
				<Logo styles={styles} />
				{widthGreater900 ? <DesktopNav dataMenu={newDataMenu} /> : <MobileNav dataMenu={newDataMenu} />}
				<div className={styles.navPanel}>
					<SearchButton />
					{widthGreater900 ? <ControlPanel index={0} styles={styles} /> : <MenuIcon />}
				</div>

				{isOpen && <SearchContainer isOpen={isOpen} />}
			</div>
		</nav>
	)
}

export default Navigation
