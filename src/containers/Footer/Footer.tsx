import styles from './Footer.module.scss'
import AnchorLink from '../../components/atoms/AnchorLink/AnchorLink'
import useSocialLinks from '../../hooks/useSocialLinks'
import SocialIcon from '../../components/atoms/SocialIcon/SocialIcon'
import useFooterSiteLinks from '../../hooks/useFooterSiteLinks'
import Subscribe from '../../components/modules/Subscription/Subscription'

const Footer = () => {
	const year = new Date().getFullYear()
	const { socialLinks } = useSocialLinks()
	const { siteLinks } = useFooterSiteLinks()
	
	return (
		<footer className={styles.footerContainer}>
			<div className={styles.footerMain}>
				<div className={`${styles.grid} row`}>
					<div className={`${styles.footerInfo} ${styles.column}`}>
						<h2 className={styles.footerTitle}>About our Site</h2>
						<p className={styles.footerText}>
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi et quisquam, rerum provident facilis
							asperiores nesciunt nihil nemo, ea, minus totam accusantium quaerat quam hic. Voluptatibus laborum
							quibusdam amet vel!
						</p>
					</div>
					<div className={`${styles.footerSiteLinks} ${styles.column}`}>
						<h2 className={styles.footerTitle}>Site Links</h2>
						<ul className={styles.footerList}>
							{siteLinks.map(link => {
								return (
									<li key={link.name}>
										<AnchorLink href={link.url}>{link.name}</AnchorLink>
									</li>
								)
							})}
						</ul>
					</div>
					<div className={`${styles.footerSocialLinks} ${styles.column}`}>
						<h2 className={styles.footerTitle}>Follow Us</h2>
						<ul className={styles.footerList}>
							{socialLinks.map(social => {
								console.log(socialLinks)
								return (
									<SocialIcon key={social.name} social={social} styles={styles}>
										{social.name}
									</SocialIcon>
								)
							})}
						</ul>
					</div>
					
					<Subscribe/>
				</div>
			</div>
			<div className={styles.footerBottom}>
				<div className={`${styles.column} row`}>
					<span className={styles.copyright}>&copy; Copyright CoderBee {year}</span>
					<span className={styles.copyright}>
						Design by{' '}
						<a href="https://www.styleshout.com/" target="_blank" rel="noopener noreferrer">
							StyleShout
						</a>
					</span>
				</div>
			</div>
		</footer>
	)
}

export default Footer
