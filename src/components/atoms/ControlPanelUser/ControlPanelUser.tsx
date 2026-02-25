import { useSelector } from 'react-redux'
import AnchorLink from '../AnchorLink/AnchorLink'
import type { RootState } from '../../../store'

import SignOutBtn from '../SingOutBtn/SignOutBtn'
import useGlobalContext from '../../../hooks/useGlobalContext'
import { accountLinks, adminLinks } from '../../../utils/sideBarLinks'
import type { KeyboardEvent } from 'react'

interface ControlPanelUserProps {
	styles: Record<string, string>
}

const ControlPanelUser = ({ styles }: ControlPanelUserProps) => {
	const { role, name, avatar } = useSelector((state: RootState) => state.auth)
	const { userRef, openCloseUserMenu, toggleMenu } = useGlobalContext()

	const admin = adminLinks[0].href
	const account = accountLinks[0].children![0].href

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			openCloseUserMenu()
		}
	}

	return (
		<div ref={userRef} className={styles.controlPanelUser}>
			<div tabIndex={0} className={styles.authorInfo} onKeyDown={e => onKeyDown(e)} onClick={() => openCloseUserMenu()}>
				<img src={`${avatar}`} alt="Avatar" className={styles.authorAvatar} />
				<span className={styles.author}>{name}</span>
			</div>
			<div className={`${styles.controlSettings} ${toggleMenu ? styles.displayVisibility : ''}`}>
				{(role === 'Admin' || role === 'Moderator') && (
					<AnchorLink className={styles.controlLinks} href={admin}>
						Admin Panel
					</AnchorLink>
				)}
				<AnchorLink className={styles.controlLinks} href={account}>
					Account
				</AnchorLink>

				<SignOutBtn className={styles.signOut}>Sign Out</SignOutBtn>
			</div>
		</div>
	)
}

export default ControlPanelUser
