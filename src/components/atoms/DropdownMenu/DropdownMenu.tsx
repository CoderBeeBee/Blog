import type { MouseEvent } from 'react'
import type { MenuTypes } from '../../../containers/Navigation/dataNavigation/dataNavigation'

import AnchorLink from '../AnchorLink/AnchorLink'
import { useLocation } from 'react-router'

interface DropdownMenuProps {
	data: MenuTypes
	handleMouseInDropdown?: (e: MouseEvent<HTMLElement>) => void
	handleMouseOutDropdown?: (e: MouseEvent<HTMLElement>) => void
	onClickCloseDropDown?: () => void
	styles: { [key: string]: string }
	toggle?: () => void
	activeIndex?: number | null
	index?: number
}

const DropdownMenu = ({
	data,
	styles,
	handleMouseInDropdown,
	handleMouseOutDropdown,
	onClickCloseDropDown,
	toggle,
	activeIndex,
	index,
}: DropdownMenuProps) => {
	const { pathname } = useLocation()

	const handleMenuItemClick = () => {
		onClickCloseDropDown?.()
		toggle?.()
	}

	return (
		<ul
			className={`${styles.subMenu} ${activeIndex === index ? styles.active : ''}`}
			onMouseEnter={e => handleMouseInDropdown?.(e)}
			onMouseLeave={e => handleMouseOutDropdown?.(e)}>
			{data.children?.map((item, index: number) => {
				const active = pathname === `/categories/${item.slug?.split(' ').join('-').toLowerCase()}`

				const active2 = pathname === item.href

				const slug = item.slug ? item.slug.split(' ').join('-').toLowerCase() : item.slug
				const url = item ? (item.name ? `/categories/${slug}` : item.href) : '#'

				const menuName = item.name ? item.name : item.title

				return (
					<li
						onClick={() => handleMenuItemClick()}
						className={`${styles.subMenuLi} ${active2 ? styles.activeSubMenuLi : ''}`}
						key={index}>
						{
							<AnchorLink
								className={`${styles.subLink} ${active ? styles.activeSubMenuLi : ''}`}
								href={url!}
								count={index}>
								{menuName}
							</AnchorLink>
						}
					</li>
				)
			})}
		</ul>
	)
}

export default DropdownMenu
