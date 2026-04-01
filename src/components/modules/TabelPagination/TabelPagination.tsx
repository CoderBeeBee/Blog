import { useCallback, useEffect, useRef, useState, type Dispatch, type MouseEvent, type SetStateAction } from 'react'
import { ChevronNextSVG, ChevronPrevSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import styles from './TabelPagination.module.scss'
import { ChevronDownSVG } from '../../../assets/icons/Icons'
interface TabelPaginationProps {
	rows: number

	rowsNumbers: number[]

	start: number
	end: number
	total: number
	setRows: Dispatch<SetStateAction<number>>
	handleChangePage: (e: MouseEvent<HTMLButtonElement>) => void
}

const TabelPagination = ({
	rows,

	rowsNumbers,
	setRows,
	start,
	end,
	total,
	handleChangePage,
}: TabelPaginationProps) => {
	const rowsRef = useRef<HTMLDivElement | null>(null)
	const [rotateArrow, setRotateArrow] = useState<boolean>(false)
	const [toggleRows, setToggleRows] = useState<boolean>(false)
	
	const handleOpenRows = useCallback(() => {
		if (!toggleRows) {
			setToggleRows(true)
			setRotateArrow(true)
		} else {
			setToggleRows(false)

			setRotateArrow(false)
		}
	}, [toggleRows])

	const handleSelectRows = (e: MouseEvent<HTMLSpanElement>) => {
		const target = e.currentTarget as HTMLSpanElement
		setRows(Number(target.dataset.value))

		handleOpenRows()
	}

	useEffect(() => {
		const handleCloseSelect = (e: globalThis.MouseEvent) => {
			const el = rowsRef.current
			const target = e.target as HTMLElement

			if (!target.classList.contains(styles.inputBox) && el?.classList.contains(styles.scaleRows)) {
				handleOpenRows()
			}
		}

		window.addEventListener('click', handleCloseSelect)

		return () => window.removeEventListener('click', handleCloseSelect)
	}, [handleOpenRows])

	return (
		<div className={styles.pagination}>
			<div className={styles.paginationRows}>
				
				<div className={styles.selectRows}>
					<div className={styles.inputBox} onClick={() => handleOpenRows()}>
						<input className={styles.selectInput} value={rows} type="text" name="rows" readOnly />

						<ChevronDownSVG className={`${styles.chevron} ${rotateArrow ? styles.chevronRotate : ''}`} />
					</div>
					<div ref={rowsRef} className={`${styles.rows} ${toggleRows ? styles.scaleRows : ''}`}>
						{rowsNumbers.map((row, index) => (
							<span
								key={index}
								data-value={row}
								className={rows === row ? styles.activeRow : ''}
								onClick={e => handleSelectRows(e)}>
								{row}
							</span>
						))}
					</div>
				</div>
			</div>
			<span className={styles.totalPages}>
				{start}-{end} of {total}
			</span>
			<div className={styles.arrowsControls}>
				<button
					data-element="prev"
					aria-label="previous page"
					className={styles.chevron}
					onClick={e => handleChangePage(e)}>
					<ChevronPrevSVG className={styles.chevronPrev} />
				</button>
				<button data-element="next" aria-label="next page" className={styles.chevron} onClick={e => handleChangePage(e)}>
					 <ChevronNextSVG className={styles.chevronNext} />
				</button>
			</div>
		</div>
	)
}

export default TabelPagination
