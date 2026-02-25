import styles from './DesktopNav.module.scss'
import { useEffect, useRef, useState, type MouseEvent, type RefObject } from 'react'
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
	const [timeOutListIn, setTimeOutListIn] = useState<ReturnType<typeof setTimeout>[]>([])
	const [timeOutListOut, setTimeOutListOut] = useState<ReturnType<typeof setTimeout>[]>([])
	const { mobileMenu } = useGlobalContext()
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

	const handleMouseIn = (e: MouseEvent<HTMLElement>, index: number) => {
		const target = e.target as HTMLElement

		if (target.dataset.element) {
			timeOutListIn.forEach(item => clearInterval(item))
			timeOutListOut.forEach(item => clearInterval(item))

			let element

			if (+target.dataset.element === index) {
				element = target.lastElementChild

				const subMenu = document.querySelectorAll(`.${styles.active}`)

				if (subMenu)
					subMenu.forEach(item => {
						item.classList.remove(styles.active)
					})
			}
			if (element) {
				element.classList.add(styles.active)
			}
		}
	}

	const handleMouseOut = (e: MouseEvent<HTMLElement>, index: number) => {
		const target = e.target as HTMLElement

		if (target.dataset.element) {
			let element

			if (+target.dataset.element === index) {
				element = target.lastElementChild
			}
			if (element) {
				const resetList = []
				const resetTime = setTimeout(() => {
					element.classList.remove(styles.active)
				}, 500)
				resetList.push(resetTime)
				setTimeOutListIn(resetList)
			}
		}
	}

	const handleMouseInDropdown = (e: MouseEvent<HTMLElement>) => {
		const target = e.target as HTMLElement
		if (target.matches(`.${styles.active}`)) {
			timeOutListIn.forEach(item => clearInterval(item))
		}

		if (target.dataset.main) {
			timeOutListOut.forEach(item => clearInterval(item))
		}
	}
	const handleMouseOutDropdown = (e: MouseEvent<HTMLElement>) => {
		const target = e.target as HTMLElement

		const subElement = target.closest('ul')

		if (subElement?.matches(`.${styles.active}`)) {
			const resetList = []
			const resetTime = setTimeout(() => {
				subElement.classList.remove(styles.active)
			}, 1000)
			resetList.push(resetTime)
			setTimeOutListOut(resetList)
		}
	}
	const handleCloseDropDown = (e: MouseEvent<HTMLLIElement>) => {
		const target = e.currentTarget
		const parentElement = target.parentElement
		if (parentElement?.classList.contains(styles.active)) {
			parentElement.classList.remove(styles.active)
		}
	}
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
						handleCloseDropDown={handleCloseDropDown}
					/>
				)
			})}
		</div>
	)
}

export default DesktopNav
