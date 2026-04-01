import styles from './DesktopNav.module.scss'
import { useEffect } from 'react'

import MenuElement from '../../../components/organism/menuElement/MenuElement'
import type { MenuTypes } from '../dataNavigation/dataNavigation'
import useWindowSize from '../../../hooks/useWindowSize'
import useGlobalContext from '../../../hooks/useGlobalContext'
interface DesktopProps {
	dataMenu: MenuTypes[]
	
}

const DesktopNav = ({  dataMenu }: DesktopProps) => {
	const { mobileMenu, handleMouseIn, handleMouseOut, handleMouseInDropdown, handleMouseOutDropdown } = useGlobalContext()
	const { close, isVisible } = mobileMenu
	const {widthGreater900} = useWindowSize()
	

	useEffect(() => {
		if (isVisible && widthGreater900) {
			close()
		}
	}, [isVisible, close, widthGreater900])

	

	return (
		<div  className={`${styles.desktopNavWrapper}`}>
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
