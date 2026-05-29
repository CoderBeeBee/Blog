import styles from './HeaderText.module.scss'

interface HeaderTextProps {
	name: string
	image: string
	description: string
}

const HeaderText = ({ name, image, description }: HeaderTextProps) => {
	return (
		<div style={{ backgroundImage: `url(${image})` }} className={`${styles.designHeader}`}>
			<div className={styles.column}>
				<span>Category</span>
				<h1>{name}</h1>
				<span>{description}</span>
			</div>
		</div>
	)
}

export default HeaderText
