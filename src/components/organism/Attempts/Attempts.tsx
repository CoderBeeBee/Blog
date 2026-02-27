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
import styles from './Attempts.module.scss'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import { ChevronDownSVG, SearchSVG } from '../../../assets/icons/Icons'
import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import { resultAttempt, rowsNumbers, theadAttempts, userAgentDevice } from '../../../utils/data'
import type { attemptsProps } from '../../../types/types'
import longDateConverter from '../../../hooks/longDateConverter'

import AttemptPopup from '../../atoms/AttemptPopup/AttemptPopup'

interface AttemptsProps {
	children: ReactNode
	attempts: attemptsProps[]
	setAction: Dispatch<SetStateAction<string>>
	setInputValue: Dispatch<SetStateAction<string>>
	setCurrentPage: Dispatch<SetStateAction<number>>
	currentPage: number
	attempActions: string[]
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

const Attempts = ({
	children,
	attempts,
	setInputValue,
	setAction,
	setCurrentPage,
	currentPage,
	attempActions,
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
	const [attemptData, setAttemptData] = useState<attemptsProps | null>(null)
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
		if (el === 'action' || el === 'result' || el === 'device') return
		listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
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

	const handleSetAction = (attempt: string, item: string) => {
		setAction(attempt)

		setSort({ sortBy: item, order: 'asc' })

		listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
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

	const handleOpenData = (attemptId: string) => {
		setOpenPopup(true)

		const filterAttempt = attempts.find(attempt => attempt._id === attemptId)
		if (filterAttempt) setAttemptData(filterAttempt)
	}

	return (
		<div className={styles.attemptsWrapper}>
			<div className={styles.listWrapperHeader}>
				<h3 className={styles.listTitle}>{children}</h3>
				<TabelSearch styles={styles} handleSetInputValue={handleSetInputValue} />
			</div>

			<div ref={listRef} className={styles.listContainer}>
				<div className={styles.tableContainer}>
					<div className={styles.thead}>
						{attempts && (
							<div className={styles.tr}>
								{theadAttempts.map((item, index) => {
									if (item !== 'data') {
										if (item === 'action' || item === 'result' || item === 'device') {
											return (
												<div data-element={item} className={styles.th} key={index} onClick={e => handleSetSort(e)}>
													{item} <ChevronDownSVG className={`${item === focusedChevron ? styles.chevronRotate : ''}`} />
													{item === 'action' && (
														<div className={styles.theadDropDown}>
															{attempActions?.map((attempt, index) => (
																<div onClick={() => handleSetAction(attempt, item)} data-element={attempt} key={index}>
																	{attempt}
																</div>
															))}
														</div>
													)}
													{item === 'result' && (
														<div className={styles.theadDropDown}>
															{resultAttempt &&
																resultAttempt.map((result: string, index) => (
																	<div onClick={() => handleSetAction(result, item)} key={index} data-element={result}>
																		{result}
																	</div>
																))}
														</div>
													)}
													{item === 'device' && (
														<div className={styles.theadDropDown}>
															{userAgentDevice &&
																userAgentDevice.map((device: string, index) => (
																	<div onClick={() => handleSetAction(device, item)} key={index} data-element={device}>
																		{device}
																	</div>
																))}
														</div>
													)}
												</div>
											)
										} else {
											return (
												<div data-element={item} className={styles.th} key={index} onClick={e => handleSetSort(e)}>
													{item} <ChevronDownSVG className={`${item === focusedChevron ? styles.chevronRotate : ''}`} />
												</div>
											)
										}
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
						{attempts &&
							attempts?.map((attempt, index: number) => (
								<div key={index} className={`${styles.tr}`}>
									<div className={styles.td}>{attempt.action}</div>
									<div className={styles.td}>{attempt.result}</div>
									<div className={styles.td}>{attempt.user.name}</div>
									<div className={styles.td}>
										{new Date(attempt.createdAt).toLocaleDateString(...longDateConverter())}
									</div>

									<div className={styles.td}>{attempt.source}</div>
									<div className={styles.td}>{attempt.ipAddress}</div>
									<div className={styles.td}>{attempt.location}</div>
									<div className={styles.td}>{attempt.userAgent.device}</div>
									<div className={styles.td}>
										<button
											type="button"
											onClick={() => handleOpenData(attempt._id)}
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

			{openPopup && <AttemptPopup setOpenPopup={setOpenPopup} attemptData={attemptData} />}
		</div>
	)
}

export default Attempts
