import useGlobalContext from '../../../hooks/useGlobalContext'
import Logo from '../logo/Logo'
import styles from './UserNavigation.module.scss'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import useWindowSize from '../../../hooks/useWindowSize'
import AnchorLink from '../AnchorLink/AnchorLink'
import LogoutButton from '../LogoutButton/LogoutButton'
import { CloseSvg } from '../../../assets/icons/Icons'
import type { KeyboardEvent } from 'react'
import CloseButton from '../CloseButton/CloseButton'

const UserNavigation = () => {
	const { isMobile, isMobilePanel } = useWindowSize()

	const { sideBarMenu, toggleMenu, userRef, openCloseUserMenu } = useGlobalContext()
	const { open, close, isOpen, isVisible } = sideBarMenu
	const { avatar, name } = useSelector((state: RootState) => state.auth)

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			openCloseUserMenu()
		}
	}
	return (
		<div className={styles.userNavigationWrapper}>
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

			<div ref={userRef} className={styles.userNavigationMenu}>
				<div tabIndex={0} className={styles.userInfo} onClick={() => openCloseUserMenu()} onKeyDown={e => onKeyDown(e)}>
					<img title="Account" src={`${avatar}`} alt="Avatar" className={styles.userAvatar} />
					<span className={styles.username}>{name}</span>
				</div>

				<div className={`${styles.userNavigationDropdown} ${toggleMenu ? styles.displayVisibility : ''} `}>
					{isMobilePanel && <CloseButton styles={styles} handleClose={openCloseUserMenu} />}
					<AnchorLink ariaLabel="Home" href="/" className={styles.userNavigationLinks} title="Home">
						Home
					</AnchorLink>
					<LogoutButton ariaLabel="Sign Out button" className={styles.userNavigationLinks}>
						Logout
					</LogoutButton>
				</div>
			</div>
		</div>
	)
}

export default UserNavigation
