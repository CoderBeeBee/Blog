import { ProfileSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import { ChevronDownSVG } from '../../../assets/icons/Icons'
import AnchorLink from '../../../components/atoms/AnchorLink/AnchorLink'
import LogoutButton from '../../../components/atoms/LogoutButton/LogoutButton'
import MenuElement from '../../../components/organism/menuElement/MenuElement'
import useGlobalContext from '../../../hooks/useGlobalContext'
import { adminSystemLinks } from '../../../utils/adminSystemLinks'
import styles from './adminSystemNavigation.module.scss'

const AdminSystemNavigation = () => {
	const {
		toggleMenu,
		openCloseUserMenu,
		onKeyDownAdminSystemMenu,
		userRef,
		
	} = useGlobalContext()

	return (
		<div className={styles.adminSystemNavigationContainer}>
			{adminSystemLinks.map((item, index) => {
				return (
					<MenuElement
						key={index}
						data={item}
						index={index + 1000}
						styles={styles}
						
					/>
				)
			})}
			<div ref={userRef} className={styles.adminSystem}>
				<div
					tabIndex={0}
					className={styles.adminInfoWrapper}
					onKeyDown={e => onKeyDownAdminSystemMenu(e)}
					onClick={() => openCloseUserMenu()}>
					<div className={styles.systemName}>Admin</div>

					<ChevronDownSVG className={`${styles.chevronDownSVG} ${toggleMenu ? styles.rotateArrow : ''}`} />
				</div>
				<div className={`${styles.adminDropdown} ${toggleMenu ? styles.displayVisibility : ''}`}>
					<AnchorLink className={styles.adminLinks} href="/admin/profile">
					<ProfileSVG/>	Profile
					</AnchorLink>

					<LogoutButton ariaLabel='Log out' className={styles.adminLinks}>Log out</LogoutButton>
				</div>
			</div>
		</div>
	)
}

export default AdminSystemNavigation
