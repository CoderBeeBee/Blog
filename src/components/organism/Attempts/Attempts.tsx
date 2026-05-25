import {
	useEffect,
	useState,
	type ChangeEvent,
	type Dispatch,
	type KeyboardEvent,
	type MouseEvent,
	
	type RefObject,
	type SetStateAction,
} from 'react'
import styles from './Attempts.module.scss'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import { ChevronDownSVG} from '../../../assets/icons/Icons'
import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import { noChevron, resultAttempt, rowsNumbers, theadAttempts } from '../../../utils/data'
import type { attemptsProps } from '../../../types/types'
import longDateConverter from '../../../hooks/longDateConverter'

import AttemptPopup from '../../atoms/AttemptPopup/AttemptPopup'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import FilterButton from '../../atoms/FilterButton/FilterButton'
import useFilters from '../../../hooks/useFilters'

import useScaleUpDropdown from '../../../hooks/useScaleUpDropdown'
import { DetailsSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'

interface AttemptsProps {
	attempts: attemptsProps[]
	
	setInputValue: Dispatch<SetStateAction<string>>
	setCurrentPage: Dispatch<SetStateAction<number>>
	currentPage: number
	attempActions: string[]
	setRows: Dispatch<SetStateAction<number>>
	setStart: Dispatch<SetStateAction<number>>
	setEnd: Dispatch<SetStateAction<number>>
	
	handleSetSort: (e: MouseEvent<HTMLDivElement | HTMLButtonElement> | KeyboardEvent) => void
	handleResetSort:()=>void
	handleSetAction: ({ sort, action }: { sort: string; action: string }) => void
	focusedChevron: string
	totalPages: number
	total: number
	rows: number
	start: number
	end: number
	listRef: RefObject<HTMLDivElement | null>
}

const Attempts = ({
	attempts,
	setInputValue,
	// setAction,
	setCurrentPage,
	currentPage,
	attempActions,
	setRows,
	setStart,
	setEnd,
	// setSort,
	handleSetSort,
	handleSetAction,handleResetSort,
	focusedChevron,
	totalPages,
	total,
	rows,
	start,
	end,
	listRef,
}: AttemptsProps) => {
	const {  setFilters } = useFilters()
	const { scaleUp, handleScaleUpDropdown, scaleRef } = useScaleUpDropdown()
	
	const [openPopup, setOpenPopup] = useState<boolean>(false)
	const [attemptData, setAttemptData] = useState<attemptsProps | null>(null)
	
	const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		const value = target.value
		setInputValue(value)
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
			<Breadcrumbs />
			<div className={styles.listWrapperTools}>
				<div className={styles.listTools}>
					<TabelSearch handleSetInputValue={handleSetInputValue} className={styles.margin} />
					<FilterButton setFilters={setFilters} handleResetSort={handleResetSort} />

					<TabelPagination
						rows={rows}
						rowsNumbers={rowsNumbers}
						start={start}
						end={end}
						total={total}
						setRows={setRows}
						handleChangePage={handleChangePage}
					/>
				</div>

				
			</div>

			<div ref={listRef} className={styles.listWrapper}>
				<table className={styles.tableWrapper}>
					<thead className={styles.thead}>
						{attempts && (
							<tr className={styles.tr}>
								{theadAttempts.map((item, index) => {
									if (!noChevron.includes(item)) {
										if (item === 'action' || item === 'result') {
											return (
												<th
													ref={el => {
														scaleRef.current[index] = el
													}}
													tabIndex={0}
													data-element={item}
													className={styles.th}
													key={index}
													onClick={e => {
														handleSetSort(e)
														handleScaleUpDropdown(index)
													}}
													onKeyDown={e => {
														if ('key' in e && e.key === 'Enter') {
															handleSetSort(e)
														}
													}}>
													{item} <ChevronDownSVG className={`${item === focusedChevron ? styles.chevronRotate : ''}`} />
													{item === 'action' && (
														<div className={`${styles.theadDropDown} ${scaleUp === index ? styles.scaleUp : ''}`}>
															{attempActions?.map((attempt, index) => (
																<div
																	onClick={() => handleSetAction({ sort: item, action: attempt })}
																	onKeyDown={e => {
																		if ('key' in e && e.key === 'Enter') {
																			handleSetAction({ sort: item, action: attempt })
																		}
																	}}
																	data-element={attempt}
																	key={index}>
																	{attempt}
																</div>
															))}
														</div>
													)}
													{item === 'result' && (
														<div className={`${styles.theadDropDown} ${scaleUp === index ? styles.scaleUp : ''}`}>
															{resultAttempt &&
																resultAttempt.map((result: string, index) => (
																	<div
																		onClick={() => handleSetAction({ sort: item, action: result })}
																		onKeyDown={e => {
																			if ('key' in e && e.key === 'Enter') {
																				handleSetAction({ sort: item, action: result })
																			}
																		}}
																		key={index}
																		data-element={result}>
																		{result}
																	</div>
																))}
														</div>
													)}
													
												</th>
											)
										} else {
											return (
												<th
													tabIndex={0}
													data-element={item}
													className={styles.th}
													key={index}
													onClick={e => handleSetSort(e)}
													onKeyDown={e => {
														if ('key' in e && e.key === 'Enter') {
															handleSetSort(e)
														}
													}}>
													{item} <ChevronDownSVG className={`${item === focusedChevron ? styles.chevronRotate : ''}`} />
												</th>
											)
										}
									} else {
										return (
											<th className={styles.th} key={index}>
												{item}
											</th>
										)
									}
								})}
							</tr>
						)}
					</thead>
					<tbody className={styles.tbody}>
						{attempts &&
							attempts?.map((attempt, index: number) => (
								<tr key={index} className={`${styles.tr}`}>
									<td className={styles.td}>{index + 1}</td>
									<td className={styles.td}>{attempt.action}</td>
									<td className={styles.td}>{attempt.result}</td>
									<td className={styles.td}>{attempt.user.name}</td>
									<td className={styles.td}>
										{new Date(attempt.createdAt).toLocaleDateString(...longDateConverter())}
									</td>

									<td className={styles.td}>{attempt.source}</td>
									
									<td className={styles.td}>
										<button
											type="button"
											onClick={() => handleOpenData(attempt._id)}
											className={styles.searchIconWrapper}>
											<DetailsSVG  />
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			{openPopup && <AttemptPopup setOpenPopup={setOpenPopup} attemptData={attemptData} />}
		</div>
	)
}

export default Attempts
