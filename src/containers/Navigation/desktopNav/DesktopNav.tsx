import styles from './DesktopNav.module.scss'
import { useEffect, useRef, type RefObject } from 'react'
import { useLocation } from 'react-router'
import MenuElement from '../../../components/organism/menuElement/MenuElement'
import type { MenuTypes } from '../dataNavigation/dataNavigation'
import useWindowSize from '../../../hooks/useWindowSize'
import useGlobalContext from '../../../hooks/useGlobalContext'
interface DesktopProps {
	dataMenu: MenuTypes[]
	navRef: RefObject<HTMLDivElement | null>
}

const DesktopNav = ({ navRef, dataMenu }: DesktopProps) => {
	const location = useLocation()
	const desktopRef = useRef<HTMLDivElement>(null)

	const { mobileMenu, handleMouseIn, handleMouseOut, handleMouseInDropdown, handleMouseOutDropdown } = useGlobalContext()
	const { close, isVisible } = mobileMenu
	const size = useWindowSize()
	const width = size.width > 900

	useEffect(() => {
		if (isVisible && width) {
			close()
		}
	}, [isVisible, close, width])

	useEffect(() => {
		if (location.pathname !== '/') {
			navRef.current?.classList.add(styles.navBgcDark)
			desktopRef.current?.classList.add(styles.navWrapper)
		} else {
			navRef.current?.classList.remove(styles.navBgcDark)
			desktopRef.current?.classList.remove(styles.navWrapper)
		}
	}, [location.pathname, navRef])

	return (
		<div ref={desktopRef} className={`${styles.desktopNavWrapper}`}>
			{dataMenu.map((item: MenuTypes, index: number) => {
				return (
					<MenuElement
						key={index}
						styles={styles}
						data={item}
						index={index}
						handleMouseIn={handleMouseIn}
						handleMouseOut={handleMouseOut}
						handleMouseInDropdown={handleMouseInDropdown}
						handleMouseOutDropdown={handleMouseOutDropdown}
					/>
				)
			})}
		</div>
	)
}

export default DesktopNav
