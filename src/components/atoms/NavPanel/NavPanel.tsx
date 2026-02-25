import { useLocation } from 'react-router'
import useGlobalContext from '../../../hooks/useGlobalContext'
import Logo from '../logo/Logo'
import styles from './NavPanel.module.scss'
import { useSelector } from 'react-redux'
import { accountLinks, adminLinks } from '../../../utils/sideBarLinks'
import type { RootState } from '../../../store'
import useWindowSize from '../../../hooks/useWindowSize'
import AnchorLink from '../AnchorLink/AnchorLink'
import SignOutBtn from '../SingOutBtn/SignOutBtn'
import { CloseSvg } from '../../../assets/icons/Icons'
import type { KeyboardEvent } from 'react'
import CloseButton from '../CloseButton/CloseButton'

const NavPanel = () => {
	const size = useWindowSize()
	const isMobile = size.width < 800
	const isMobilePanel = size.width < 600
	const { sideBarMenu, toggleMenu, userRef, openCloseUserMenu } = useGlobalContext()
	const { open, close, isOpen, isVisible } = sideBarMenu
	const { pathname } = useLocation()
	const { isLogged, role, avatar, name } = useSelector((state: RootState) => state.auth)
	const admin = adminLinks[0].href
	const account = accountLinks[0].children![0].href

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			openCloseUserMenu()
		}
	}
	return (
		<div className={styles.navPanelWrapper}>
			{isMobile && (
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
			<Logo styles={styles} />

			<div ref={userRef} className={styles.navPanelMenu}>
				<img
					tabIndex={0}
					title="Account"
					src={`${avatar}`}
					onClick={() => openCloseUserMenu()}
					onKeyDown={e => onKeyDown(e)}
					alt="Avatar"
					className={styles.userAvatar}
				/>

				<div className={`${styles.navPanelDropdown} ${toggleMenu ? styles.displayVisibility : ''} `}>
					{isMobilePanel && <CloseButton styles={styles} handleClose={openCloseUserMenu} />}

					<span className={styles.userName}>{name}</span>
					{role === 'User' ? (
						''
					) : !pathname.startsWith('/account') ? (
						(!isLogged || (isLogged && (role === 'Admin' || role === 'Moderator'))) && (
							<AnchorLink
								handleClose={close}
								title="Account"
								ariaLabel="Account"
								className={styles.navDropdownLinks}
								href={account}>
								Account
							</AnchorLink>
						)
					) : (
						<AnchorLink
							handleClose={close}
							ariaLabel="Admin Panel"
							href={admin}
							className={styles.navDropdownLinks}
							title="Admin Panel">
							Dashboard
						</AnchorLink>
					)}
					<SignOutBtn ariaLabel="Sign Out button" className={styles.signOut}>
						Sign Out
					</SignOutBtn>
				</div>
			</div>
		</div>
	)
}

export default NavPanel
