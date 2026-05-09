import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'
import { useDeleteTagMutation, useFetchAllTagsQuery, type AllTagsProps } from '../../../slices/api/tagsApi'
import styles from './PostTagsList.module.scss'
import TabelSearch from '../TabelSearch/TabelSearch'
import TabelPagination from '../TabelPagination/TabelPagination'
import useSort from '../../../hooks/useSort'
import useOpenClosePopup from '../../../hooks/useOpenClosePopup'
import useCheckMark from '../../../hooks/useCheckMark'
import DeleteAllButton from '../../atoms/DeleteAllButton/DeleteAllButton'
import { noChevron, rowsNumbers, theadTags } from '../../../utils/data'
import useDebounce from '../../../hooks/useDebounce'
import Popup from '../../atoms/Popup/Popup'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import CheckMark from '../../atoms/Checkmark/CheckMark'
import NotificationNew from '../../atoms/NotificationNew/NotificationNew'
import timePass from '../../../hooks/timePass'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import dateConverter from '../../../hooks/dateConverter'
import { ChevronDownSVG } from '../../../assets/icons/Icons'

const PostTagsList = () => {
	const [deleteTag] = useDeleteTagMutation()
	const { openPopup, popUpMessage, setPopUpMessage, handleOpenPopup, handleClosePopup } = useOpenClosePopup()
	const { sort, listRef, handleSetSort, focusedChevron } = useSort()
	// const { filters, setFilters } = useFilters()
	const { handleCheckMark, checked, handleCheckMarkAll, isCheckedAll, handleClearCheckedSet } = useCheckMark()

	const [rows, setRows] = useState<number>(10)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)
	const { data } = useFetchAllTagsQuery({
		limit: rows,
		page: currentPage,
		search,
		sortBy: sort.sortBy,
		order: sort.order,
	})
	const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		const value = target.value
		setInputValue(value)
	}
	console.log(data);
	const { allTags = [], totalPages = 1, total = 1 } = data ?? {}

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

	useEffect(() => {
		const start = (currentPage - 1) * rows + 1
		if (currentPage > totalPages) {
			setCurrentPage(totalPages === 0 ? 1 : totalPages)
		}
		setStart(start)
		const end = Math.min(rows * currentPage, total)
		setEnd(end)
	}, [currentPage, rows, total, totalPages])

	const handleDeleteTag = async () => {
		try {
			const res = await deleteTag([...checked]).unwrap()
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
		const tagsId = allTags.map((tag: AllTagsProps) => tag._id)

		handleCheckMarkAll(tagsId)
	}
	return (
		<div className={`${styles.tagsListWrapper}`}>
			<h3 className={styles.tagsTitle}>Tag List</h3>
			<div className={styles.listWrapperTools}>
				<div className={styles.listTools}>
					<TabelSearch className={styles.search} handleSetInputValue={handleSetInputValue} />

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
			</div>

			<div ref={listRef} className={styles.listWrapper}>
				<table className={styles.tableWrapper}>
					<thead className={styles.thead}>
						<tr className={styles.tr}>
							{theadTags.map((item, index) => {
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
						{allTags &&
							allTags?.map((tag: AllTagsProps, index: number) => {
								const isChecked = checked.has(tag._id)

								return (
									<tr key={index} className={`${styles.tr} `}>
										<td className={styles.td} onClick={() => handleCheckMark(tag._id)}>
											<CheckMark className={styles.checkmark} isChecked={isChecked} />
										</td>
										<td className={styles.td}>{index + 1}</td>
										<td className={styles.td}>
											<span className={styles.textEllipsis}>{tag.name}</span>{' '}
											{timePass(tag.createdAt, 1) && <NotificationNew />}
										</td>

										<td className={styles.td}>
											<AnchorLink
												ariaLabel="Username"
												className={styles.tabelLink}
												href={`/admin/users/profile/${tag.author._id}`}>
												{tag.author.name}
											</AnchorLink>
										</td>

										<td className={styles.td}>{new Date(tag.createdAt).toLocaleString(...dateConverter())}</td>
									</tr>
								)
							})}
					</tbody>
				</table>
			</div>

			{openPopup && (
				<Popup handleClosePopup={handleClosePopup} handleDelete={handleDeleteTag} popUpMessage={popUpMessage}>
					{!popUpMessage && (
						<div className={styles.popupInfo}>
							<p className={styles.popupTitle}>
								{checked.size} {checked.size > 1 ? 'Tags' : 'Tag'}:
							</p>
							<div className={styles.popupDeletedList}>
								{[...checked].map((tagId, index) => {
									const tag = allTags.find((com: AllTagsProps) => com._id === tagId)
									return (
										<span key={tagId} className={styles.popupItem}>
											{index + 1}. <span>{tag?.name}</span>
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

export default PostTagsList
