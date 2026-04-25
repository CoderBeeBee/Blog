import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import type { MenuTypes } from '../../../containers/Navigation/dataNavigation/dataNavigation'

import DropdownMenu from '../../atoms/DropdownMenu/DropdownMenu'
import useGlobalContext from '../../../hooks/useGlobalContext'
import { ChevronDownSVG } from '../../../assets/icons/Icons'

import useWindowSize from '../../../hooks/useWindowSize'
interface MenuElementProps {
	data: MenuTypes
	index: number
	styles: { [key: string]: string }
}

const MenuElement = ({
	data,
	index,
	styles,
}: MenuElementProps) => {
	const { widthLess900 } = useWindowSize()
	const {
		expandMenu,
		collapseMenu,
		expandCollapseDropdown,
		onClickCollapseDropdown,
		onKeyDown,
		activeIndex,
		mobileMenu,
		
	} = useGlobalContext()
	const { toggle } = mobileMenu
	

	if (data.href === '') {
		return (
			<div key={index} className={`${styles.menuElementContainer} ${activeIndex === index ? styles.active : ''}`}>
				<div
					tabIndex={0}
					className={styles.menuElement}
					onMouseEnter={() => {
						if (widthLess900) return

						expandMenu(index)
					}}
					onMouseLeave={() => {
						if (widthLess900) return

						collapseMenu()
					}}
					onClick={() => {
						if (widthLess900) {
							expandCollapseDropdown(index)
						}
					}}
					onKeyDown={e => onKeyDown(e, index)}>
					<span className={styles.title}>{data.title}</span>

					<ChevronDownSVG className={`${styles.chevron} ${activeIndex === index ? styles.rotateArrow : ''}`} />
				</div>

				{data.children?.length && <DropdownMenu styles={styles} data={data} index={index}  />}
			</div>
		)
	} else {
		return (
			<AnchorLink
				toggle={toggle}
				onClickCollapseDropdown={onClickCollapseDropdown}
				key={index}
				href={data.href}
				className={styles.link}>
				{data.title}
			</AnchorLink>
		)
	}
}

export default MenuElement
