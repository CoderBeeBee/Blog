import AnchorLink from '../AnchorLink/AnchorLink'
import useGlobalContext from '../../../hooks/useGlobalContext'
import useWindowSize from '../../../hooks/useWindowSize'
import { ChevronDownSVG } from '../../../assets/icons/Icons'

interface ControlPanelSignInProps {
	styles: Record<string, string>
}

const ControlPanelSignIn = ({ styles }: ControlPanelSignInProps) => {
	const { width } = useWindowSize()
	const { userRef, toggleMenu, openCloseUserMenu } = useGlobalContext()

	return (
		<div ref={userRef} className={styles.signInWrapper}>
			<div
				className={styles.signinBox}
				onClick={() => {
					openCloseUserMenu()
				}}>
				<button type="button" className={styles.signInButton}>
					Sign In
				</button>
				{width < 900 && (
					<ChevronDownSVG className={`${styles.chevronDownSVG} ${toggleMenu ? styles.rotateArrow : ''}`} />
				)}
			</div>

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
