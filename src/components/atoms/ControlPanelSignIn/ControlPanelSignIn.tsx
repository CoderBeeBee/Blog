import AnchorLink from '../AnchorLink/AnchorLink'
import useGlobalContext from '../../../hooks/useGlobalContext'

interface ControlPanelSignInProps {
	styles: Record<string, string>
}

const ControlPanelSignIn = ({ styles }: ControlPanelSignInProps) => {
	const { userRef, openCloseUserMenu, toggleMenu } = useGlobalContext()
	return (
		<div ref={userRef} className={styles.signInWrapper}>
			<button type="button" onClick={() => openCloseUserMenu()} className={styles.signInBtn}>
				Sign In
			</button>

			<div className={`${styles.linksWrapper} ${toggleMenu ? styles.displayVisibility : ''}`}>
				<AnchorLink className={styles.anchorLink} href="/login">
					Sign In
				</AnchorLink>
				<div className={styles.signUpWrapper}>
					<span className={styles.signUpSpan}>Don't have an Account?</span>
					<AnchorLink className={styles.anchorLink} href="/registration">
						Sign Up
					</AnchorLink>
				</div>
			</div>
		</div>
	)
}

export default ControlPanelSignIn
