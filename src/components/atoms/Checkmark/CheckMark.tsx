import { CheckSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import styles from './CheckMark.module.scss'

interface CheckMarkProps {
	isChecked: boolean
	className?: string
}

const CheckMark = ({ isChecked, className }: CheckMarkProps) => {
	return (
		<>
			<div className={`${styles.checkmark} ${isChecked ? styles.scaleCheckmark : ''} ${className ? className : ''}`}>
				<CheckSVG className={`${styles.checkmarkSVG} `} />
			</div>
			<div className={`${styles.animCheckmark} ${isChecked ? styles.animCheckmarkActive : ''}`}></div>
		</>
	)
}

export default CheckMark
