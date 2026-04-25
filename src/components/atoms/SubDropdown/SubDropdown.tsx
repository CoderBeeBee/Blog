import styles from './SubDropdown.module.scss'
import type { MenuItem } from '../../../containers/Navigation/dataNavigation/dataNavigation'

import AnchorLink from '../AnchorLink/AnchorLink'
import { useLocation } from 'react-router'

import useWindowSize from '../../../hooks/useWindowSize'
import useGlobalContext from '../../../hooks/useGlobalContext'

interface SubDropdownProps {
	data: MenuItem[]
	toggle?: () => void
	index?: number
	parentIndex: number | undefined
}

const SubDropdown = ({ data, toggle, parentIndex, index }: SubDropdownProps) => {
	const { widthLess900 } = useWindowSize()
	const { pathname } = useLocation()

	const { onClickCollapseDropdown, hoverOverSubdropdown, hoverOverCollapseSubdropdown, activeIndex, activeSubIndex } =
		useGlobalContext()

	const handleMenuItemClick = () => {
		onClickCollapseDropdown()
		toggle?.()
	}

	return (
		<ul
			className={`${styles.subMenu} ${activeIndex === parentIndex && activeSubIndex === index ? styles.activeSub : ''}`}
			onMouseEnter={() => {
				if (widthLess900) return
				hoverOverSubdropdown()
				
			}}
			onMouseLeave={() => {
				if (widthLess900) return

				hoverOverCollapseSubdropdown()
			}}>
			{data.map((item, i: number) => {
				const menuName = item.name ? item.name : item.title
				const active = pathname === item.slug

				const active2 = pathname === item.href

				const url = item ? (item.name ? item.slug : item.href) : '#'

				return (
					<li
						onClick={() => handleMenuItemClick()}
						className={`${styles.subMenuLi} ${active2 ? styles.activeSubMenuLi : ''}`}
						key={i}>
						{
							<AnchorLink className={`${styles.subLink} ${active ? styles.activeSubMenuLi : ''}`} href={url!} count={i}>
								{menuName}
							</AnchorLink>
						}
					</li>
				)
			})}
		</ul>
	)
}

export default SubDropdown
