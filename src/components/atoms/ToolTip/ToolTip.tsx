import { TipSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import styles from './ToolTip.module.scss'
import useGlobalContext from '../../../hooks/useGlobalContext'

interface ToolTipProps {
	id: string
	tipMessage?: string
	isSubmitting?: boolean
}

const ToolTip = ({ id, tipMessage, isSubmitting }: ToolTipProps) => {
	const { toolTipId, expandToolTip, collapseToolTip } = useGlobalContext()
	const isActive = id === toolTipId

	return (
		<div className={`${styles.tooltipBox}`}>
			<button
				type="button"
				aria-label="Tool tip"
				className={`${styles.tooltip}`}
				onMouseEnter={() => expandToolTip(id)}
				onMouseLeave={() => collapseToolTip()}
				disabled={isSubmitting}>
				<TipSVG className={`${styles.tipSVG}`} />
			</button>
			<div
			onMouseEnter={() => expandToolTip(id)}
				onMouseLeave={() => collapseToolTip()}
			className={`${styles.tooltipInfo} ${isActive && styles.displayToolTip}`}>
				<p className={`${styles.tooltipText}`}>{tipMessage}</p>
			</div>
		</div>
	)
}

export default ToolTip
