import { TrashSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import styles from './DeleteAllButton.module.scss'
interface DeleteAllButtonProps {
	handleOpenPopup: () => void
}
const DeleteAllButton = ({ handleOpenPopup }: DeleteAllButtonProps) => {
	return (
		<button
			type="button"
			aria-label="Delete all"
			title="Delete all"
			className={`${styles.deleteAllButton}`}
			onClick={() => handleOpenPopup()}
            
            >
			<TrashSVG className={styles.trashSVG} />
		</button>
	)
}

export default DeleteAllButton
