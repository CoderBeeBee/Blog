import { type KeyboardEvent, type MouseEvent } from 'react'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import type { MenuTypes } from '../../../containers/Navigation/dataNavigation/dataNavigation'

import DropdownMenu from '../../atoms/DropdownMenu/DropdownMenu'
import useGlobalContext from '../../../hooks/useGlobalContext'
import { ChevronDownSVG } from '../../../assets/icons/Icons'
interface MenuElementProps {
	data: MenuTypes
	index: number
	styles: { [key: string]: string }
	handleMouseIn?: (index: number) => void
	handleMouseOut?: () => void
	handleMouseInDropdown?: (e: MouseEvent<HTMLElement>) => void
	handleMouseOutDropdown?: (e: MouseEvent<HTMLElement>) => void
	handleOpenCloseDropdown?: (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
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
	handleOpenCloseDropdown,

	toggle,
}: MenuElementProps) => {
	const { activeIndex, onKeyDown,onClickCloseDropDown } = useGlobalContext()

	if (data.href === '') {
		return (
			<div
				key={index}
				data-element={index}
				tabIndex={0}
				className={`${styles.menuElementContainer} ${activeIndex === index ? styles.active : ''}`}
				onMouseEnter={() => handleMouseIn?.(index)}
				onMouseLeave={() => handleMouseOut?.()}
				onClick={e => handleOpenCloseDropdown?.(e)}
				onKeyDown={e => onKeyDown(e, index)}>
				<div className={styles.menuElement}>
					<span className={styles.title}>{data.title}</span>

					<ChevronDownSVG className={`${styles.chevron} ${activeIndex === index ? styles.rotateArrow : ''}`} />
				</div>

				{data.children?.length && (
					<DropdownMenu
						styles={styles}
						activeIndex={activeIndex}
						data={data}
						index={index}
						toggle={toggle}
						onClickCloseDropDown={onClickCloseDropDown}
						handleMouseInDropdown={handleMouseInDropdown}
						handleMouseOutDropdown={handleMouseOutDropdown}
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
