import type { MouseEvent } from 'react'
import type { MenuItem } from '../../../containers/Navigation/dataNavigation/dataNavigation'

import AnchorLink from '../AnchorLink/AnchorLink'
import { useLocation } from 'react-router'

interface DropdownMenuProps {
	data: MenuItem[]
	handleMouseInDropdown?: (e: MouseEvent<HTMLElement>) => void
	handleMouseOutDropdown?: (e: MouseEvent<HTMLElement>) => void
	onClickCloseDropDown?: () => void
	
	styles: { [key: string]: string }
	toggle?: () => void
	activeIndex?: number | null
	index?: number
}

const SubDropdown = ({
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
			{data.map((item, i: number) => {
				const menuName = item.name ? item.name : item.title
				const active = pathname === item.slug

				const active2 = pathname === item.href

				const url = item ? (item.name ? item.slug : item.href) : '#'
                console.log(data);
				
					return (
						<li
							onClick={() => handleMenuItemClick()}
							className={`${styles.subMenuLi} ${active2 ? styles.activeSubMenuLi : ''}`}
							key={i}>
							{
								<AnchorLink
									className={`${styles.subLink} ${active ? styles.activeSubMenuLi : ''}`}
									href={url!}
									count={i}>
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
