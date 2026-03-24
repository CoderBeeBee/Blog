import { useEffect, type ChangeEvent, type Dispatch, type MouseEvent, type SetStateAction } from 'react'
import styles from './ChangeHistory.module.scss'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import { ChevronDownSVG } from '../../../assets/icons/Icons'
import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import { noChevron, rowsNumbers, theadHistory } from '../../../utils/data'
import type { auditlogsProps } from '../../../types/types'

import useSort from '../../../hooks/useSort'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import useFilters from '../../../hooks/useFilters'
import FilterButton from '../../atoms/FilterButton/FilterButton'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { DetailsSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import dateConverter from '../../../hooks/dateConverter'

interface AttemptsProps {
	auditlogs: auditlogsProps[]
	setInputValue: Dispatch<SetStateAction<string>>
	setCurrentPage: Dispatch<SetStateAction<number>>
	currentPage: number
	setRows: Dispatch<SetStateAction<number>>
	setStart: Dispatch<SetStateAction<number>>
	setEnd: Dispatch<SetStateAction<number>>
	// setSort: Dispatch<SetStateAction<{ sortBy: string; order: string }>>
	totalPages: number
	total: number
	rows: number
	start: number
	end: number
	href:string
}

const ChangeHistory = ({
	auditlogs,
	setInputValue,
	setCurrentPage,
	currentPage,
	setRows,
	setStart,
	setEnd,
	// setSort,
	totalPages,
	total,
	rows,
	start,
	end,
	href
}: AttemptsProps) => {
	const { listRef, handleSetSort, focusedChevron, handleResetSort } = useSort()
	
	const filtersOption = ['none']
	const { filters, setFilters } = useFilters()
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

	return (
		<div className={styles.changeHistoryWrapper}>
			<Breadcrumbs />
			<div className={styles.listWrapperTools}>
				<div className={styles.listTools}>
					<TabelSearch className={styles.search} handleSetInputValue={handleSetInputValue} />
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

				{filters && (
					<div className={styles.filtersWrapper}>
						{filtersOption.map(option => {
							return (
								<button
									key={option}
									data-element={option}
									type="button"
									aria-label="Filter button"
									onClick={e => handleSetSort(e)}
									onKeyDown={e => {
										if ('key' in e && e.key === 'Enter') {
											handleSetSort(e)
										}
									}}
									className={styles.filterButton}>
									{option}{' '}
									<ChevronDownSVG
										className={`${styles.chevronSVG} ${option === focusedChevron ? styles.chevronRotate : ''}`}
									/>
								</button>
							)
						})}
					</div>
				)}
			</div>

			<div ref={listRef} className={styles.listWrapper}>
				<table className={styles.tableWrapper}>
					<thead className={styles.thead}>
						{auditlogs && (
							<tr className={styles.tr}>
								{theadHistory.map((item, index) => {
									if (!noChevron.includes(item)) {
										return (
											<th data-element={item} className={styles.th} key={index} onClick={e => handleSetSort(e)}>
												{item}{' '}
												<ChevronDownSVG
												
													className={`${styles.chevronSVG} ${item === focusedChevron ? styles.chevronRotate : ''}`}
												/>
											</th>
										)
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
						{auditlogs &&
							auditlogs?.map((audit, index: number) => (
								<tr key={index} className={`${styles.tr}`}>
									<td className={styles.td}>{index + 1}</td>
									<td className={styles.td}>{audit.action}</td>
									<td className={styles.td}>{audit.performedBy ? audit.performedBy : undefined}</td>

									<td className={styles.td}>{new Date(audit.createdAt).toLocaleDateString(...dateConverter())}</td>

									<td className={styles.td}>{audit.source}</td>

									<td className={styles.td}>
										<AnchorLink ariaLabel='Details' title='Details' href={href} className={styles.detailsLink}>
											<DetailsSVG />
										</AnchorLink>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default ChangeHistory
