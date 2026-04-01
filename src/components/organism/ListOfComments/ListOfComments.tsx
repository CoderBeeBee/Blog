import { DetailsSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'

import type { CommentsProps } from '../../../types/types'
import styles from './ListOfComments.module.scss'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'

import useDebounce from '../../../hooks/useDebounce'

import { noChevron, rowsNumbers, theadComments } from '../../../utils/data'

import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'

import timePass from '../../../hooks/timePass'
import Popup from '../../atoms/Popup/Popup'
import { useDeleteCommentMutation, useFetchAllCommentsQuery } from '../../../slices/api/commentsApi'
import NotificationNew from '../../atoms/NotificationNew/NotificationNew'
import handleCreateUrl from '../../../hooks/createUrl'

import { ChevronDownSVG } from '../../../assets/icons/Icons'
import useSort from '../../../hooks/useSort'
import useOpenClosePopup from '../../../hooks/useOpenClosePopup'
import useCheckMark from '../../../hooks/useCheckMark'
import useFilters from '../../../hooks/useFilters'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'

import FilterButton from '../../atoms/FilterButton/FilterButton'
import DeleteAllButton from '../../atoms/DeleteAllButton/DeleteAllButton'
import CheckMark from '../../atoms/Checkmark/CheckMark'
import dateConverter from '../../../hooks/dateConverter'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const ListOfComments = () => {
	const filtersOption = [] as const
	const { openPopup, popUpMessage, setPopUpMessage, handleOpenPopup, handleClosePopup } = useOpenClosePopup()
	const { sort, listRef, handleSetSort, focusedChevron } = useSort()
	const { filters, setFilters } = useFilters()
	const { handleCheckMark, checked, handleCheckMarkAll, isCheckedAll, handleClearCheckedSet } = useCheckMark()

	const [rows, setRows] = useState<number>(10)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)
	const [deleteComment] = useDeleteCommentMutation()

	const { data } = useFetchAllCommentsQuery({
		limit: rows,
		page: currentPage,
		search: search,
		sortBy: sort.sortBy,
		order: sort.order,
	})

	const { allcomments = [], totalPages = 1, total = 1 } = data ?? {}

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

	const handleDeleteComment = async () => {
		try {
			const res = await deleteComment([...checked]).unwrap()

			if (res) setPopUpMessage(res.message)
			handleClearCheckedSet()
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
		const commentsId = allcomments.map((com: CommentsProps) => com._id)

		handleCheckMarkAll(commentsId)
	}
	// if (isFetching) return <Loader />
	return (
		<div className={styles.listContainer}>
			<Breadcrumbs />
			<div className={styles.listWrapperTools}>
				<div className={styles.listTools}>
					<TabelSearch className={styles.search} handleSetInputValue={handleSetInputValue} />
					<FilterButton setFilters={setFilters} />
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
							{theadComments.map((item, index) => {
								if (!noChevron.includes(item)) {
									return (
										<th data-element={item} className={styles.th} key={index} onClick={e => handleSetSort(e)}>
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
						{allcomments &&
							allcomments?.map((com: CommentsProps, index: number) => {
								const isChecked = checked.has(com._id)
								return (
									<tr key={index} className={`${styles.tr} `}>
										<td className={styles.td} onClick={() => handleCheckMark(com._id)}>
											<CheckMark className={styles.checkmark} isChecked={isChecked} />
										</td>
										<td className={styles.td}>{index + 1}</td>
										<td className={styles.td}>
											<span className={styles.textEllipsis}>{com.comment}</span>{' '}
											{timePass(com.createdAt, 1) && <NotificationNew />}
										</td>
										<td className={styles.td}>
											<AnchorLink
												className={`${styles.tabelLink} ${styles.textEllipsis}`}
												href={handleCreateUrl({ categories: com.categories, seo: com.seo, _id: com.postId })}>
												{com.title}
											</AnchorLink>
										</td>
										<td className={styles.td}>
											<AnchorLink
												ariaLabel="Username"
												className={styles.tabelLink}
												href={`/admin/users/profile/${com.author._id}`}>
												{com.author.name}
											</AnchorLink>
										</td>

										<td className={styles.td}>{new Date(com.createdAt).toLocaleString(...dateConverter())}</td>

										<td className={styles.td}>
											<AnchorLink ariaLabel="Details" title="Details" href={`/admin/comments/detail/${com.author._id}`}>
												<DetailsSVG />
											</AnchorLink>
										</td>
									</tr>
								)
							})}
					</tbody>
				</table>
			</div>

			{openPopup && (
				<Popup handleClosePopup={handleClosePopup} handleDelete={handleDeleteComment} popUpMessage={popUpMessage}>
					{!popUpMessage && (
						<div className={styles.popupInfo}>
							<p className={styles.popupTitle}>
								{checked.size} {checked.size > 1 ? 'Comments' : 'Comment'}:
							</p>
							<div className={styles.popupDeletedList}>
								{[...checked].map((comId, index) => {
									const comment = allcomments.find((com: CommentsProps) => com._id === comId)
									return (
										<span key={comId} className={styles.popupItem}>
											{index + 1}. <span>{comment?.comment}</span>
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

export default ListOfComments
