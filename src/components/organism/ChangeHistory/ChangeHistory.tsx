import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type Dispatch,
	type MouseEvent,
	type ReactNode,
	type SetStateAction,
} from 'react'
import styles from './ChangeHistory.module.scss'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import { ChevronDownSVG, SearchSVG } from '../../../assets/icons/Icons'
import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import { rowsNumbers, theadHistory } from '../../../utils/data'
import type { auditlogsProps } from '../../../types/types'
import longDateConverter from '../../../hooks/longDateConverter'
import AttemptPopup from '../../atoms/AttemptPopup/AttemptPopup'

interface AttemptsProps {
	children: ReactNode
	auditlogs: auditlogsProps[]
	setInputValue: Dispatch<SetStateAction<string>>
	setCurrentPage: Dispatch<SetStateAction<number>>
	currentPage: number
	setRows: Dispatch<SetStateAction<number>>
	setStart: Dispatch<SetStateAction<number>>
	setEnd: Dispatch<SetStateAction<number>>
	setSort: Dispatch<SetStateAction<{ sortBy: string; order: string }>>
	totalPages: number
	total: number
	rows: number
	start: number
	end: number
}

const ChangeHistory = ({
	children,
	auditlogs,
	setInputValue,
	setCurrentPage,
	currentPage,
	setRows,
	setStart,
	setEnd,
	setSort,
	totalPages,
	total,
	rows,
	start,
	end,
}: AttemptsProps) => {
	const [focusedChevron, setFocusedChevron] = useState<string>('')
	const [openPopup, setOpenPopup] = useState<boolean>(false)
	const [auditlogData, setAuditlogData] = useState<auditlogsProps | null>(null)
	const listRef = useRef<HTMLDivElement | null>(null)
	const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		const value = target.value
		setInputValue(value)
	}

	const handleSetSort = (e: MouseEvent<HTMLDivElement>) => {
		const target = e.currentTarget as HTMLDivElement
		const el = target.dataset.element
		const lastChild = target.lastElementChild

		const allLastChild = document.querySelectorAll(`.${styles.scaleUp}`)

		if (!lastChild?.classList.contains(styles.scaleUp)) {
			if (allLastChild) allLastChild.forEach(el => el.classList.remove(styles.scaleUp))

			lastChild?.classList.add(styles.scaleUp)
		} else {
			lastChild?.classList.remove(styles.scaleUp)
		}
		if (!el) return
		if (el !== focusedChevron) {
			setFocusedChevron(el)
		} else {
			setFocusedChevron('')
		}
		if (el === 'createdAt') {
			setSort(prev => {
				const newOrder = prev.sortBy === el ? (prev.order === 'asc' ? 'desc' : 'asc') : 'desc'

				return { sortBy: el, order: newOrder }
			})
			return
		}

		setSort(prev => {
			const newOrder = prev.sortBy === el ? (prev.order === 'desc' ? 'asc' : 'desc') : 'asc'

			return { sortBy: el, order: newOrder }
		})
	}

	useEffect(() => {
		const start = (currentPage - 1) * rows + 1
		if (currentPage > totalPages) {
			setCurrentPage(totalPages === 0 ? 1 : totalPages)
		}
		setStart(start)
		const end = Math.min(rows * currentPage, total)
		setEnd(end)
	}, [currentPage, rows, setCurrentPage, setEnd, setStart, total, totalPages])

	const handleChangePage = (e: MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement

		if (target.dataset.element === 'prev') {
			if (currentPage > 1) {
				setCurrentPage(prev => prev - 1)
			}
		} else {
			if (currentPage !== totalPages) {
				setCurrentPage(prev => prev + 1)
			}
		}

		listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleOpenData = (auditId: string) => {
		setOpenPopup(true)

		const filterData = auditlogs.find(audit => audit._id === auditId)
		if (filterData) setAuditlogData(filterData)
	}

	return (
		<div className={styles.changeHistoryWrapper}>
			<div className={styles.listWrapperHeader}>
				<h3 className={styles.listTitle}>{children}</h3>
				<TabelSearch styles={styles} handleSetInputValue={handleSetInputValue} />
			</div>

			<div ref={listRef} className={styles.listContainer}>
				<div className={styles.tableContainer}>
					<div className={styles.thead}>
						{auditlogs && (
							<div className={styles.tr}>
								{theadHistory.map((item, index) => {
									if (item !== 'data') {
										return (
											<div data-element={item} className={styles.th} key={index} onClick={e => handleSetSort(e)}>
												{item} <ChevronDownSVG className={`${item === focusedChevron ? styles.chevronRotate : ''}`} />
											</div>
										)
									} else {
										return (
											<div className={styles.th} key={index}>
												{item}
											</div>
										)
									}
								})}
							</div>
						)}
					</div>
					<div className={styles.tbody}>
						{auditlogs &&
							auditlogs?.map((audit, index: number) => (
								<div key={index} className={`${styles.tr}`}>
									<div className={styles.td}>{audit.action}</div>
									<div className={styles.td}>{audit.performedBy ? audit.performedBy : undefined}</div>
									<div className={styles.td}>{audit.role}</div>
									<div className={styles.td}>
										{new Date(audit.createdAt).toLocaleDateString(...longDateConverter())}
									</div>

									<div className={styles.td}>{audit.source}</div>

									<div className={styles.td}>
										<button
											type="button"
											onClick={() => handleOpenData(audit._id)}
											className={styles.searchIconWrapper}>
											<SearchSVG className={styles.searchIcon} />
										</button>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
			<TabelPagination
				rows={rows}
				rowsNumbers={rowsNumbers}
				start={start}
				end={end}
				total={total}
				setRows={setRows}
				handleChangePage={handleChangePage}
			/>

			{openPopup && <AttemptPopup setOpenPopup={setOpenPopup} auditlogData={auditlogData} />}
		</div>
	)
}

export default ChangeHistory
