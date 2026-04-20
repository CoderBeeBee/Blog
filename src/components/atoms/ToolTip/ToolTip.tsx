import { TipSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import styles from './ToolTip.module.scss'

interface ToolTipProps {
	id: string
	tipMessage?: string
	displayToolTip: string
	onMouseEnterToolTip: (id: string) => void
	onMouseLeaveToolTip: () => void
}

const ToolTip = ({ id, tipMessage, displayToolTip, onMouseEnterToolTip, onMouseLeaveToolTip }: ToolTipProps) => {
	const isActive = id === displayToolTip

	return (
		<div className={`${styles.tooltipBox}`}>
			<button
				type="button"
				aria-label="Tool tip"
				className={`${styles.tooltip}`}
				onMouseEnter={() => onMouseEnterToolTip(id)}
				onMouseLeave={() => onMouseLeaveToolTip()}>
				<TipSVG className={`${styles.tipSVG}`} />
			</button>
			<div className={`${styles.tooltipInfo} ${isActive && styles.displayToolTip}`}>
				<p className={`${styles.tooltipText}`}>{tipMessage}</p>
			</div>
		</div>
	)
}

export default ToolTip
