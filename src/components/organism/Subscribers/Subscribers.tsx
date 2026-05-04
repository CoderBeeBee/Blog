import styles from './Subsribers.module.scss'
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'
import { useDeleteSubscriberMutation, useFetchSubscribersQuery } from '../../../slices/api/subscriptionApi'
import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import useDebounce from '../../../hooks/useDebounce'
import { noChevron, rowsNumbers, theadSubscribers } from '../../../utils/data'

import longDateConverter from '../../../hooks/longDateConverter'
import { ChevronDownSVG } from '../../../assets/icons/Icons'
import Popup from '../../atoms/Popup/Popup'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import FilterButton from '../../atoms/FilterButton/FilterButton'
import DeleteAllButton from '../../atoms/DeleteAllButton/DeleteAllButton'
import useFilters from '../../../hooks/useFilters'
import useCheckMark from '../../../hooks/useCheckMark'
import useSort from '../../../hooks/useSort'
import useOpenClosePopup from '../../../hooks/useOpenClosePopup'
import CheckMark from '../../atoms/Checkmark/CheckMark'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const Subscribers = () => {
	const filtersOption = ['-----']
	const { handleCheckMark, checked, handleCheckMarkAll, isCheckedAll, handleClearCheckedSet } = useCheckMark()
	const { sort, listRef, handleSetSort, focusedChevron, handleResetSort } = useSort()
	const { openPopup, popUpMessage, setPopUpMessage, handleOpenPopup, handleClosePopup } = useOpenClosePopup()

	const [deleteSubscriber, ] = useDeleteSubscriberMutation()
	const [rows, setRows] = useState<number>(10)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const { filters, setFilters } = useFilters()
	// const [subscriber, setSubscriber] = useState({
	// 	email: '',
	// 	subId: '',
	// })

	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)

	const { data } = useFetchSubscribersQuery({
		limit: rows,
		page: currentPage,
		search: search,
		sortBy: sort.sortBy,
		order: sort.order,
	})
	// console.log(data);
	const { subscribers = [], totalPages = 1, total = 1 } = data ?? {}

	// useEffect(() => {
	// 	refetch()
	// }, [data, refetch])

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
	}, [currentPage, rows, total, totalPages])

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

	const handleDeleteSubscriber = async () => {
		try {
			if (checked.size > 0) {
				const res = await deleteSubscriber([...checked]).unwrap()

				if (res) setPopUpMessage(res.message as string)
				console.log(res)
				// handleClearCheckedSet()
			}

			// refetch()
		} catch (error) {
			if (typeof error === 'object' && error !== null) {
				const fetchError = error as FetchBaseQueryError
				const message =
					fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
						? (fetchError.data.message as string)
						: 'An unexpected error has occurder'

				setPopUpMessage(message)
			} else {
				setPopUpMessage('An unexpected error has occurder')
			}
		}
	}
	
	const checkMarkAll = () => {
		const subId = subscribers.map(sub => sub._id)

		handleCheckMarkAll(subId)
	}
	return (
		<div className={styles.subscribersWrapper}>
			<Breadcrumbs />
			<div className={styles.listWrapperTools}>
				<div className={styles.listTools}>
					<TabelSearch handleSetInputValue={handleSetInputValue} />
					<FilterButton setFilters={setFilters} handleResetSort={handleResetSort} />
					{(isCheckedAll || checked.size >= 1) && <DeleteAllButton handleOpenPopup={handleOpenPopup} />}
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
						<tr className={styles.tr}>
							{theadSubscribers.map((item, index) => {
								if (!noChevron.includes(item)) {
									return (
										<th
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
								} else {
									if (item === 'checkmark')
										return (
											<th tabIndex={0} className={styles.th} key={index} onClick={() => checkMarkAll()}>
												<CheckMark className={styles.checkmark} isChecked={isCheckedAll} />
											</th>
										)

									return (
										<th className={styles.th} key={index}>
											{item}
										</th>
									)
								}
							})}
						</tr>
					</thead>
					<tbody className={styles.tbody}>
						{subscribers &&
							subscribers?.map((sub, index: number) => {
								const isChecked = checked.has(sub._id)
								const shouldShow = isChecked && popUpMessage
								const message = popUpMessage && isChecked ? popUpMessage : 'Deleting'
								return (
									<tr key={index} className={`${styles.tr} `}>
										<td className={styles.td} onClick={() => handleCheckMark(sub._id)}>
											<CheckMark className={styles.checkmark} isChecked={isChecked} />
										</td>
										<td className={styles.td}>{index + 1}</td>
										<td className={styles.td}>{sub.email}</td>
										<td className={styles.td}>{`${sub.isVerified}`}</td>
										<td className={styles.td}>{new Date(sub.createdAt).toLocaleDateString(...longDateConverter())}</td>
										<td className={styles.td}>
											{sub.lastSent !== null
												? new Date(sub.lastSent).toLocaleDateString(...longDateConverter())
												: '-----'}
										</td>
										<td className={styles.td}>
											{sub.nextSent !== null
												? new Date(sub.nextSent).toLocaleDateString(...longDateConverter())
												: '-----'}
										</td>
										{shouldShow && <div className={styles.deletedSub}>{message}</div>}
									</tr>
								)
							})}
					</tbody>
				</table>
			</div>

			{openPopup && (
				<Popup handleClosePopup={handleClosePopup} handleDelete={handleDeleteSubscriber} popUpMessage={popUpMessage}>
					{!popUpMessage && (
						<div className={styles.popupInfo}>
							<p className={styles.popupTitle}>Subscribers:</p>
							<div className={styles.popupDeletedList}>
								{[...checked].map((subId, index) => {
									const subscriber = subscribers.find(sub => sub._id === subId)
									return (
										<span key={subId}>
											{index + 1}. <span>{subscriber?.email}</span>
										</span>
									)
								})}
							</div>
						</div>
					)}
				</Popup>
			)}
		</div>
	)
}

export default Subscribers
