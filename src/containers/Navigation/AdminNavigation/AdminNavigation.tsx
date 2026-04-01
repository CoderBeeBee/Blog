import { useSelector } from 'react-redux'
import useWindowSize from '../../../hooks/useWindowSize'
import styles from './AdminNavigation.module.scss'
import type { RootState } from '../../../store'
import useGlobalContext from '../../../hooks/useGlobalContext'
import Logo from '../../../components/atoms/logo/Logo'
import LogoutButton from '../../../components/atoms/LogoutButton/LogoutButton'
import CloseButton from '../../../components/atoms/CloseButton/CloseButton'
import { CloseSvg } from '../../../assets/icons/Icons'
import type { KeyboardEvent } from 'react'
import AnchorLink from '../../../components/atoms/AnchorLink/AnchorLink'
import { WebsiteSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'

const AdminNavigation = () => {
	const { isMobilePanel, widthLess1100 } = useWindowSize()

	const { sideBarMenu, toggleMenu, userRef, openCloseUserMenu } = useGlobalContext()
	const { open, close, isOpen, isVisible } = sideBarMenu
	const { avatar, name, role } = useSelector((state: RootState) => state.auth)

	const onKeyDown = (e: KeyboardEvent) => {
		if ('key' in e && e.key === 'Enter') {
			openCloseUserMenu()
		}
	}
	return (
		<div className={styles.adminNavigationWrapper}>
			{widthLess1100 && (
				<div className={styles.sideBarMenuButtons}>
					<button
						type="button"
						className={` ${styles.sideBarMenuButton} ${isOpen ? styles.toggleMenuButton : ''} ${isVisible ? styles.hideMenuButton : ''} `}
						title="Menu"
						onKeyDown={e => {
							if (e.key === 'Enter') {
								open()
							}
						}}
						onClick={() => {
							open()
						}}>
						<span className={styles.span}></span>
					</button>

					<button
						type="button"
						className={` ${styles.sideBarCloseButton} ${isVisible ? styles.toggleCloseButton : ''} ${isOpen ? styles.displayCloseButton : ''}`}
						title="Close"
						onKeyDown={e => {
							if (e.key === 'Enter') {
								close()
							}
						}}
						onClick={() => {
							close()
						}}>
						<CloseSvg className={styles.icon} />
					</button>
				</div>
			)}
			{!isMobilePanel && <Logo styles={styles} />}

			<div ref={userRef} className={styles.adminNavigationMenu}>
				<div className={styles.adminMenu}>
					<AnchorLink
						href="/"
						target="_blank"
						rel="noopener noreferrer"
						ariaLabel="Website"
						className={styles.adminViewWebsite}>
						<WebsiteSVG />
						View website
					</AnchorLink>
					<div
						tabIndex={0}
						className={styles.adminInfo}
						onClick={() => openCloseUserMenu()}
						onKeyDown={e => onKeyDown(e)}>
						<img title="Account" src={`${avatar}`} alt="Avatar" className={styles.adminAvatar} />
						<div className={styles.adminData}>
							<span className={styles.adminName}>{role}</span>
							<span className={styles.adminRole}>{name}</span>
						</div>
					</div>
				</div>

				<div className={`${styles.adminNavigationDropdown} ${toggleMenu ? styles.displayVisibility : ''} `}>
					{isMobilePanel && <CloseButton styles={styles} handleClose={openCloseUserMenu} />}
					<AnchorLink className={styles.adminNavigationLinks} href="/admin/profile">
						Profile
					</AnchorLink>
					<LogoutButton ariaLabel="Sign Out button" className={styles.adminNavigationLinks}>
						Logout
					</LogoutButton>
				</div>
			</div>
		</div>
	)
}

export default AdminNavigation
