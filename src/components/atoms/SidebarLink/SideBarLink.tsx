import { useRef, type KeyboardEvent } from 'react'
import AnchorLink from '../AnchorLink/AnchorLink'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import styles from './SideBarLink.module.scss'
import { useLocation } from 'react-router'
import type { sideBarLinksProps } from '../../../types/types'
import useGlobalContext from '../../../hooks/useGlobalContext'
import { ChevronDownSVG } from '../../../assets/icons/Icons'

interface SideBarLinkProps {
	data: sideBarLinksProps
	index: number
	activeDashboardIndex: number | null
	expandCollapseDashboardDropdown: (index: number) => void
	
}

const SideBarLink = ({
	data,
	index,
	activeDashboardIndex,
	
	expandCollapseDashboardDropdown,
}: SideBarLinkProps) => {
	const { sideBarMenu } = useGlobalContext()
	const { close } = sideBarMenu

	const arrowRef = useRef<SVGSVGElement | null>(null)
	const sideBarLinkRef = useRef<HTMLDivElement | null>(null)
	const { pathname } = useLocation()

	const active = pathname === data.href
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			expandCollapseDashboardDropdown(index)
		}
	}


	if (data.href === '') {
		return (
			<div
				ref={sideBarLinkRef}
				key={index}
				data-element={index}
				className={`${styles.sideBarLink} ${activeDashboardIndex === index ? styles.activeSubLinks : ''} `}>
				<div
					tabIndex={0}
					onKeyDown={e => onKeyDown(e)}
					className={`${styles.sideBarLinkHelper} ${activeDashboardIndex === index ? styles.activeSideBarLink : ''}`}
					onClick={() => {
						expandCollapseDashboardDropdown(index)
					}}>
					<div className={styles.sideBarLinkFocus}></div>

					<div className={styles.divideSideBar}>
						<div className={styles.sideBarLinkName}>
							{data.icon} <p>{data.title}</p>
						</div>
						<ChevronDownSVG
							arrowRef={arrowRef}
							className={`${styles.chevron} ${activeDashboardIndex === index ? styles.rotateArrow : ''}`}
						/>
					</div>
				</div>

				{data.children?.length ? (
					<DropdownMenu
						styles={styles}
						data={data}
						closeDashboardMenu={() => {
							close()
						}}
					/>
				) : null}
			</div>
		)
	} else {
		return (
			<AnchorLink
				onKeyDown={e => onKeyDown(e)}
				handleClose={() => {
					expandCollapseDashboardDropdown(index)
					close()
				}}
				className={styles.sideBarLink}
				href={data.href}
				ariaLabel={data.title}>
				<div
					tabIndex={0}
					className={`${styles.sideBarLinkHelper} ${styles.sideBarPadding} ${active ? styles.activeSideBarLink : ''}`}>
					<div className={styles.sideBarLinkFocus}></div>

					<div className={styles.divideSideBar}>
						<div className={styles.sideBarLinkName}>
							{data.icon} <p>{data.title}</p>
						</div>
					</div>
				</div>
			</AnchorLink>
		)
	}
}

export default SideBarLink
