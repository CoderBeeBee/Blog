import { TrashSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import styles from './DeleteButton.module.scss'
interface DeleteButtonProps {
    dataIndex?:number | undefined
    onClickDelete?:(index:number | undefined)=>void
    isSubmitting?:boolean
    title:string
    ariaLabel:string
}

const DeleteButton = ({onClickDelete,dataIndex,isSubmitting,title,ariaLabel}:DeleteButtonProps) => {
	return (
		<button
			type="button"
			title={title}
			disabled={isSubmitting}
			aria-label={ariaLabel}
			onClick={() => onClickDelete?.(dataIndex)}
			className={styles.deleteBtnWrapper}>
			
			<TrashSVG />
		</button>
	)
}

export default DeleteButton
