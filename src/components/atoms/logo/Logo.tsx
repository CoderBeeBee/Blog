
import useGlobalContext from '../../../hooks/useGlobalContext'
import AnchorLink from '../AnchorLink/AnchorLink'
interface LogoProps {
	styles: Record<string, string>
}
const Logo = ({ styles }: LogoProps) => {
	const { basic } = useGlobalContext()
	const logoSrc = typeof basic?.logo?.src === 'string' ? basic.logo.src : undefined
	return (
		<AnchorLink href="/" ariaLabel="Logo" title="Logo" className={styles.logo}>
			<img src={logoSrc} alt="Logo" />
		</AnchorLink>
	)
}

export default Logo
