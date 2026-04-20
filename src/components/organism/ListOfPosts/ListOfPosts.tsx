import { DetailsSVG, PencilSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import { useDeletePostsMutation, useFetchPostsByLimitQuery } from '../../../slices/api/postApi'
import type { ExtendedArticleContentProps } from '../../../types/types'
import styles from './ListOfPosts.module.scss'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'

import useDebounce from '../../../hooks/useDebounce'

import { defaultCategories, rowsNumbers, postStatus, theadPost, noChevron } from '../../../utils/data'

import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import Popup from '../../atoms/Popup/Popup'
import timePass from '../../../hooks/timePass'
import NotificationNew from '../../atoms/NotificationNew/NotificationNew'

import { useFetchAllCategoriesQuery } from '../../../slices/api/categoriesApi'
import createUrl from '../../../hooks/createUrl'

import { ChevronDownSVG } from '../../../assets/icons/Icons'
import CheckMark from '../../atoms/Checkmark/CheckMark'
import dateConverter from '../../../hooks/dateConverter'
import useWindowSize from '../../../hooks/useWindowSize'
import FilterButton from '../../atoms/FilterButton/FilterButton'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import useCheckMark from '../../../hooks/useCheckMark'
import useFilters from '../../../hooks/useFilters'
import CreateButton from '../../atoms/CreateButton/CreateButton'
import DeleteAllButton from '../../atoms/DeleteAllButton/DeleteAllButton'
import useScaleUpDropdown from '../../../hooks/useScaleUpDropdown'
import useOpenClosePopup from '../../../hooks/useOpenClosePopup'
import useSort from '../../../hooks/useSort'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import longDateConverter from '../../../hooks/longDateConverter'

const ListOfPosts = () => {
	const { widthLess1300, widthLess800, widthLess700 } = useWindowSize()
	const filtersOption = ['created At', 'published At', 'scheduled At', 'comments']
	const { handleCheckMark, checked, handleCheckMarkAll, isCheckedAll, handleClearCheckedSet } = useCheckMark()
	const { filters, setFilters } = useFilters()
	const { scaleUp, handleScaleUpDropdown, scaleRef } = useScaleUpDropdown()
	const { openPopup, popUpMessage, setPopUpMessage, handleOpenPopup, handleClosePopup } = useOpenClosePopup()
	const { sort, action, listRef, handleSetAction, handleSetSort, setSort, setAction, focusedChevron, handleResetSort } =
		useSort()
	const activeColumn =
		sort.sortBy === 'scheduled At' ? 'scheduled At' : sort.sortBy === 'published At' ? 'published At' : 'created At'
	const activeColumn2 = sort.sortBy === 'comments' ? 'comments' : 'views'
	const [rows, setRows] = useState<number>(10)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)
	const [deletePost] = useDeletePostsMutation()
	const { data: categories } = useFetchAllCategoriesQuery()
	const allCategories = categories && categories?.length > 0 ? categories : defaultCategories

	const { data } = useFetchPostsByLimitQuery({
		limit: rows,
		page: currentPage,
		search: search,
		sortBy: sort.sortBy,
		order: sort.order,

		action,
	})

	const { posts = [], totalPages = 1, total = 1 } = data ?? {}

	const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		const value = target.value
		setInputValue(value)
	}

	useEffect(() => {
		if (inputValue === '') {
			setSort({ sortBy: '', order: '' })
			setAction('')
		}
	}, [inputValue, setAction, setSort])

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

	const handleDeletePost = async () => {
		try {
			const res = await deletePost([...checked]).unwrap()

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
		const postsID = posts.map(post => post._id)

		handleCheckMarkAll(postsID)
	}
	// const handlePublishPost = async (e: MouseEvent<HTMLParagraphElement>) => {
	// 	const target = e.currentTarget as HTMLParagraphElement
	// 	const postId = target.dataset.id

	// 	try {
	// 		await publishPost(postId).unwrap()

	// 		refetch()
	// 	} catch (error) {
	// 		console.log(error)
	// 	}
	// }

	return (
		<div className={styles.postsWrapper}>
			<Breadcrumbs />
			<div className={styles.listWrapperTools}>
				<div className={styles.listTools}>
					<CreateButton href="/admin/blog/addpost" ariaLabel="Create new post" className={styles.createNew} />
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
						{posts && (
							<tr className={styles.tr}>
								{theadPost
									.filter(
										f =>
											!['created At', 'scheduled At', 'published At', 'comments', 'views'].includes(f) ||
											[activeColumn, activeColumn2].includes(f),
									)
									.map((item, index) => {
										if (!noChevron.includes(item)) {
											if (item === 'categories' || item === 'status') {
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
														{item}{' '}
														<ChevronDownSVG
															className={`${styles.chevronSVG} ${item === focusedChevron ? styles.chevronRotate : ''}`}
														/>
														{item === 'categories' && (
															<div className={`${styles.theadDropDown} ${scaleUp === index ? styles.scaleUp : ''}`}>
																{allCategories?.map((c, index) => (
																	<div
																		tabIndex={0}
																		onClick={() => handleSetAction({ sort: item, action: c.name })}
																		onKeyDown={e => {
																			if ('key' in e && e.key === 'Enter') {
																				handleSetAction({ sort: item, action: c.name })
																			}
																		}}
																		data-element={c}
																		key={index}>
																		{c.name}
																	</div>
																))}
															</div>
														)}
														{item === 'status' && (
															<div className={`${styles.theadDropDown} ${scaleUp === index ? styles.scaleUp : ''}`}>
																{postStatus &&
																	postStatus.map((status, index) => (
																		<div
																			tabIndex={0}
																			onClick={() => {
																				handleSetAction({ sort: item, action: status.name })
																			}}
																			onKeyDown={e => {
																				if ('key' in e && e.key === 'Enter') {
																					handleSetAction({ sort: item, action: status.name })
																				}
																			}}
																			key={index}
																			data-element={status.name}>
																			{status.name}
																		</div>
																	))}
															</div>
														)}
													</th>
												)
											} else {
												if (
													(widthLess1300 && item === activeColumn) ||
													(widthLess800 && item === 'author') ||
													(widthLess700 && item === 'views')
												)
													return null

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
														{item}{' '}
														<ChevronDownSVG
															className={`${styles.chevronSVG} ${item === focusedChevron ? styles.chevronRotate : ''}`}
														/>
													</th>
												)
											}
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
						)}
					</thead>
					<tbody className={styles.tbody}>
						{posts &&
							posts?.map((post: ExtendedArticleContentProps, index: number) => {
								const isChecked = checked.has(post._id)
								const url = createUrl({ slug: post.seo?.slug, _id: post._id })
								return (
									<tr key={index} className={`${styles.tr}`}>
										<td className={styles.td} onClick={() => handleCheckMark(post._id)}>
											<CheckMark className={styles.checkmark} isChecked={isChecked} />
										</td>
										<td className={styles.td}>{index + 1}</td>
										<td className={styles.td}>
											<img src={post.mainImage.src} alt={post.mainImage.alt} loading="lazy" />
										</td>
										<td className={styles.td}>
											<AnchorLink className={styles.listPostTitle} href={url}>
												{post.title}
											</AnchorLink>
											{timePass(post.createdAt, 3) && <NotificationNew />}
										</td>
										<td className={`${styles.td} ${styles.categories}`}>
											{post.categories.length > 1 ? post.categories.join(' / ') : post.categories}
										</td>
										{!widthLess800 && <td className={styles.td}>{post.author.name}</td>}
										{!widthLess700 &&
											(activeColumn2 === 'comments' ? (
												<td className={styles.td}>{post.commentsCount}</td>
											) : (
												<td className={styles.td}>{post.postViews}</td>
											))}
										{!widthLess1300 &&
											(activeColumn === 'scheduled At' ? (
												<td className={styles.td}>
													{post.scheduledAt !== null
														? new Date(post.scheduledAt).toLocaleDateString(...longDateConverter())
														: '-----'}
												</td>
											) : activeColumn === 'published At' ? (
												<td className={styles.td}>
													{new Date(post.publishedAt).toLocaleDateString(...dateConverter())}{' '}
												</td>
											) : (
												<td className={styles.td}>{new Date(post.createdAt).toLocaleDateString(...dateConverter())}</td>
											))}

										<td className={`${styles.td}`}>
											<span
												className={` ${post.status === 'Published' ? styles.published : ''} ${post.status === 'Draft' ? styles.draft : ''} ${post.status === 'Scheduled' ? styles.scheduled : ''}`}>
												{post.status}
											</span>{' '}
										</td>
										<td className={styles.td}>
											<AnchorLink
												className={styles.editButton}
												title="Edit"
												href={`/admin/blog/editpost/?id=${post._id}`}>
												<PencilSVG />
											</AnchorLink>
											<AnchorLink
												href={`/admin/blog/post-details/?id=${post._id}`}
												title="Details"
												aria-label="Details"
												className={styles.detailsButton}>
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
				<Popup handleClosePopup={handleClosePopup} handleDelete={handleDeletePost} popUpMessage={popUpMessage}>
					{!popUpMessage && (
						<div className={styles.popupInfo}>
							<p className={styles.popupTitle}>Post titles:</p>
							<div className={styles.popupDeletedList}>
								{[...checked].map((postId, index) => {
									const post = posts.find(post => post._id === postId)
									return (
										<span key={postId}>
											{index + 1}. <span>„{post?.title}”</span>
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

export default ListOfPosts
