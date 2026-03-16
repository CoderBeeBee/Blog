import { useSelector } from 'react-redux'
import AnchorLink from '../AnchorLink/AnchorLink'
import type { RootState } from '../../../store'


import useGlobalContext from '../../../hooks/useGlobalContext'
import { accountLinks } from '../../../utils/sideBarLinks'
import type { KeyboardEvent } from 'react'
import LogoutButton from '../LogoutButton/LogoutButton'
import useWindowSize from '../../../hooks/useWindowSize'
import { ChevronDownSVG } from '../../../assets/icons/Icons'

interface ControlPanelUserProps {
	styles: Record<string, string>
}

const ControlPanelUser = ({ styles }: ControlPanelUserProps) => {
	const {width} = useWindowSize()
	const { name, avatar } = useSelector((state: RootState) => state.auth)
	const { userRef, openCloseUserMenu, toggleMenu } = useGlobalContext()

	const account = accountLinks[0].children![0].href

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			openCloseUserMenu()
		}
	}

	return (
		<div ref={userRef} className={styles.controlPanelUser}>
			<div tabIndex={0} className={styles.userInfoWrapper} onKeyDown={e => onKeyDown(e)} onClick={() => openCloseUserMenu()}>
				<div className={styles.userInfo}>

				<img src={`${avatar}`} alt="Avatar" className={styles.userAvatar} />
				<span className={styles.username}>{name}</span>
				</div>
				{width < 900 && <ChevronDownSVG className={`${styles.chevronDownSVG} ${toggleMenu ? styles.rotateArrow : ''}`}/>}
			</div>
			<div className={`${styles.controlSettings} ${toggleMenu ? styles.displayVisibility : ''}`}>
				<AnchorLink className={styles.controlLinks} href={account}>
					Profile
				</AnchorLink>

				<LogoutButton className={styles.logout}>Logout</LogoutButton>
			</div>
		</div>
	)
}

export default ControlPanelUser
