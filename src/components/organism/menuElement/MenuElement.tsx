import { useState, type MouseEvent } from 'react'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import type { MenuTypes } from '../../../containers/Navigation/dataNavigation/dataNavigation'

import DropdownMenu from '../../atoms/DropdownMenu/DropdownMenu'
import useGlobalContext from '../../../hooks/useGlobalContext'
import { ChevronDownSVG } from '../../../assets/icons/Icons'
interface MenuElementProps {
	data: MenuTypes
	index: number
	styles: { [key: string]: string }
	handleMouseIn?: (e: MouseEvent<HTMLElement>, index: number) => void
	handleMouseOut?: (e: MouseEvent<HTMLElement>, index: number) => void
	handleMouseInDropdown?: (e: MouseEvent<HTMLElement>) => void
	handleMouseOutDropdown?: (e: MouseEvent<HTMLElement>) => void
	handleCloseDropDown?: (e: MouseEvent<HTMLLIElement>) => void
	toggle?: () => void
}

const MenuElement = ({
	data,
	index,
	styles,
	handleMouseIn,
	handleMouseOut,
	handleMouseInDropdown,
	handleMouseOutDropdown,
	handleCloseDropDown,
	toggle,
}: MenuElementProps) => {
	const { handleOpenCloseDropdown, activeIndex } = useGlobalContext()
	const [onkeyToogle, setOnKeyToggle] = useState<number | null>(null)
	if (data.href === '') {
		return (
			<div
				key={index}
				data-element={index}
				tabIndex={0}
				className={`${styles.menuElementContainer} ${activeIndex === index ? styles.active : ''}`}
				onMouseEnter={e => handleMouseIn?.(e, index)}
				onMouseLeave={e => handleMouseOut?.(e, index)}
				onClick={e => handleOpenCloseDropdown(e)}
				onKeyDown={e => {
					if ('key' in e && e.key !== 'Enter') return
					if (onkeyToogle === index) {
						setOnKeyToggle(null)
					} else {
						setOnKeyToggle(index)
					}
				}}>
				<div className={styles.menuElement}>
					<span className={styles.title}>{data.title}</span>

					<ChevronDownSVG className={`${styles.chevron} ${activeIndex === index ? styles.rotateArrow : ''}`} />
				</div>

				{data.children?.length && (
					<DropdownMenu
						styles={styles}
						onkeyToogle={onkeyToogle}
						data={data}
						index={index}
						toggle={toggle}
						handleMouseInDropdown={handleMouseInDropdown}
						handleMouseOutDropdown={handleMouseOutDropdown}
						handleCloseDropDown={handleCloseDropDown}
					/>
				)}
			</div>
		)
	} else {
		return (
			<AnchorLink
				handleOpenCloseMenu={toggle}
				handleOpenCloseDropdown={handleOpenCloseDropdown}
				key={index}
				href={data.href}
				className={styles.link}>
				{data.title}
			</AnchorLink>
		)
	}
}

export default MenuElement
