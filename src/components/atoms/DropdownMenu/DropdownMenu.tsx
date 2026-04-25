import type { MenuItem } from '../../../containers/Navigation/dataNavigation/dataNavigation'

import AnchorLink from '../AnchorLink/AnchorLink'
import { useLocation } from 'react-router'
import SubDropdown from '../SubDropdown/SubDropdown'
import useGlobalContext from '../../../hooks/useGlobalContext'
import useWindowSize from '../../../hooks/useWindowSize'

interface DropdownMenuProps {
	data: MenuItem
	styles: { [key: string]: string }
	index?: number
	closeDashboardMenu?: () => void
}

const DropdownMenu = ({ data, styles, index, closeDashboardMenu }: DropdownMenuProps) => {
	const { widthLess900 } = useWindowSize()
	const { pathname } = useLocation()

	const {
		collapseMenu,

		onKeyDownSub,
		onClickCollapseDropdown,
		expandCollapseSubDropdown,
		expandSubDropdown,
		collapseSubDropdown,
		hoverOverDropdown,
		activeIndex,
		activeSubIndex,
		mobileMenu,
	} = useGlobalContext()
	const { toggle } = mobileMenu

	return (
		<ul
			className={`${styles.subMenu} ${activeIndex === index ? styles.active : ''}`}
			onMouseEnter={() => {
				if (widthLess900) return

				hoverOverDropdown()
			}}
			onMouseLeave={() => {
				if (widthLess900) return
				collapseMenu()
			}}>
			{data &&
				data.children?.map((item: MenuItem, i: number) => {
					const menuName = item.name ? item.name : item.title
					const active = pathname === item.slug

					const active2 = pathname === item.href

					const url = item ? (item.name ? item.slug : item.href) : '#'

					if (item.children && item.children?.length) {
						return (
							<li
								className={`${styles.subMenuLi} ${active2 ? styles.activeSubMenuLi : ''}  ${activeIndex === index && activeSubIndex === i ? styles.activeSub : ''}`}
								key={i}>
								<span
									tabIndex={0}
									className={`${styles.subLink} ${active ? styles.activeSubMenuLi : ''}`}
									onMouseEnter={() => {
										if (widthLess900) return
										expandSubDropdown(i)
									}}
									onMouseLeave={() => {
										if (widthLess900) return

										collapseSubDropdown()
									}}
									onClick={() => {
										if (!widthLess900) return
										expandCollapseSubDropdown(i)
									}}
									onKeyDown={e => onKeyDownSub(e, i)}>
									{menuName}
								</span>

								{item.children && <SubDropdown data={item.children} index={i} parentIndex={index} toggle={toggle} />}
							</li>
						)
					} else {
						return (
							<li
								onClick={() => {
									onClickCollapseDropdown()
									closeDashboardMenu?.()
								}}
								className={`${styles.subMenuLi} ${active2 ? styles.activeSubMenuLi : ''}`}
								key={i}>
								{
									<AnchorLink
										toggle={toggle}
										className={`${styles.subLink} ${active ? styles.activeSubMenuLi : ''}`}
										href={url!}
										count={i}>
										{menuName}
									</AnchorLink>
								}
							</li>
						)
					}
				})}
		</ul>
	)
}

export default DropdownMenu
