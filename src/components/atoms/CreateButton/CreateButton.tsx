import AnchorLink from '../AnchorLink/AnchorLink'
import { PlusSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import styles from './CreateButton.module.scss'

interface CreateButtonProps {
	className?: string
	href: string
	ariaLabel: string
}

const CreateButton = ({ className, href, ariaLabel }: CreateButtonProps) => {
	return (
		<AnchorLink
			href={href}
			ariaLabel={ariaLabel}
			title="Create"
			className={`${styles.createNewPost} ${className ? className : ''}`}>
			<PlusSVG /> Create
		</AnchorLink>
	)
}

export default CreateButton
