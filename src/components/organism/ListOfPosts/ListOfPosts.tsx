import { PencilSVG, TrashSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import { useDeletePostMutation, useFetchPostsByLimitQuery, usePublishPostMutation } from '../../../slices/api/postApi'
import type { ExtendedArticleContentProps } from '../../../types/types'
import styles from './ListOfPosts.module.scss'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react'

import useDebounce from '../../../hooks/useDebounce'

import { defaultCategories, rowsNumbers, status, thead } from '../../../utils/data'
// import { categories } from '../../../containers/Navigation/dataNavigation/dataNavigation'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import Popup from '../../atoms/Popup/Popup'
import timePass from '../../../hooks/timePass'
import NotificationNew from '../../atoms/NotificationNew/NotificationNew'

import { useFetchAllCategoriesQuery } from '../../../slices/api/categoriesApi'
import createUrl from '../../../hooks/createUrl'

import dateConverter from '../../../hooks/dateConverter'
import { ChevronDownSVG } from '../../../assets/icons/Icons'

const ListOfPosts = () => {
	const popupRef = useRef<HTMLDivElement | null>(null)
	const [popUpMessage, setPopUpMessage] = useState<string>('')
	const [focusedChevron, setFocusedChevron] = useState<string>('')
	const [postData, setPostData] = useState({
		postId: '',
		postTitle: '',
	})
	const [rows, setRows] = useState<number>(10)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [sort, setSort] = useState({
		sortBy: '',
		order: '',
	})
	const [category, setCategory] = useState<string>('')
	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)
	const { data, refetch } = useFetchPostsByLimitQuery({
		limit: rows,
		page: currentPage,
		search: search,
		sortBy: sort.sortBy,
		order: sort.order,
		category: category,
	})
	const [deletePost] = useDeletePostMutation()

	const [publishPost] = usePublishPostMutation()
	const { posts = [], totalPages = 1, total = 1 } = data ?? {}

	const { data: categories } = useFetchAllCategoriesQuery()

	const allCategories = categories && categories?.length > 0 ? categories : defaultCategories

	useEffect(() => {
		refetch()
	}, [data, refetch])

	const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		const value = target.value
		setInputValue(value)
	}

	useEffect(() => {
		if (inputValue === '') {
			setSort({ sortBy: '', order: '' })
			setCategory('')
		}
	}, [inputValue])

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
		if (el === 'status' || el === 'categories') return
		if (el === 'createdAt' || el === 'publishedAt' || el === 'comments' || el === 'views') {
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
	const handleSetCategory = (item: string) => {
		setCategory(item)
		setSort({ sortBy: 'categories', order: 'desc' })
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
	}

	const handleDeletePost = async () => {
		try {
			const res = await deletePost(postData.postId).unwrap()

			setPopUpMessage(res.message)
			refetch()
		} catch (error) {
			console.log(error)
		}
	}

	const handleOpenPopup = (e: MouseEvent<HTMLDivElement>) => {
		const target = e.currentTarget as HTMLDivElement
		const postId = target.dataset.id
		const postTitle = target.dataset.name
		if (postId && postTitle)
			setPostData({
				postId,
				postTitle,
			})

		if (!popupRef.current?.classList.contains(styles.openPopup)) {
			popupRef.current?.classList.add(styles.openPopup)
		}
	}
	const handleClosePopup = () => {
		if (popupRef.current?.classList.contains(styles.openPopup)) {
			popupRef.current?.classList.remove(styles.openPopup)
		}
		setPopUpMessage('')
	}

	const handlePublishPost = async (e: MouseEvent<HTMLParagraphElement>) => {
		const target = e.currentTarget as HTMLParagraphElement
		const postId = target.dataset.id

		try {
			await publishPost(postId).unwrap()

			refetch()
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className={styles.listWrapper}>
			<h3 className={styles.listTitle}>List of Posts</h3>
			<TabelSearch styles={styles} handleSetInputValue={handleSetInputValue} />

			<div className={styles.listContainer}>
				<div className={styles.tableContainer}>
					<div className={styles.thead}>
						{posts && (
							<div className={styles.tr}>
								{thead.map((item, index) => {
									if (item !== 'actions') {
										if (item === 'categories' || item === 'status') {
											return (
												<div data-element={item} className={styles.th} key={index} onClick={e => handleSetSort(e)}>
													{item} <ChevronDownSVG className={`${item === focusedChevron ? styles.chevronRotate : ''}`} />
													{item === 'categories' && (
														<div className={styles.theadDropDown}>
															{allCategories?.map((c, index) => (
																<div onClick={() => handleSetCategory(c.name)} data-element={c} key={index}>
																	{c.name}
																</div>
															))}
														</div>
													)}
													{item === 'status' && (
														<div className={styles.theadDropDown}>
															{status &&
																status.map((item: string, index) => (
																	<div
																		onClick={() => {
																			if (item.toLowerCase() === 'draft') {
																				setSort({ sortBy: item.toLowerCase(), order: 'asc' })
																			} else {
																				setSort({ sortBy: item.toLowerCase(), order: 'desc' })
																			}
																		}}
																		key={index}
																		data-element={item}>
																		{item}
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
						{posts &&
							posts?.map((post: ExtendedArticleContentProps, index: number) => (
								<div key={index} className={`${styles.tr} ${post.status === 'draft' ? styles.draft : ''}`}>
									<div className={styles.td}>
										<AnchorLink
											className={styles.tabelTitle}
											href={createUrl({ categories: post.categories, seo: post.seo, _id: post._id })}>
											{post.title}
											{timePass(post.createdAt, 3) && <NotificationNew />}
										</AnchorLink>
									</div>
									<div className={styles.td}>{post.author.name}</div>
									<div className={styles.td}>
										{post.categories.length > 1 ? post.categories.join(', ') : post.categories}
									</div>
									<div className={styles.td}>{new Date(post.createdAt).toLocaleDateString(...dateConverter())}</div>
									<div className={`${styles.td} ${post.publishedAt ? '' : styles.publish}`}>
										{post.publishedAt ? (
											new Date(post.publishedAt).toLocaleDateString(...dateConverter())
										) : (
											<p data-id={post._id} onClick={e => handlePublishPost(e)}>
												Publish
											</p>
										)}
									</div>
									<div className={styles.td}>{post.commentsCount}</div>
									<div className={styles.td}>{post.postViews}</div>
									<div className={styles.td}>{post.status}</div>
									<div className={styles.td}>
										<AnchorLink href={`/admin/posts/editpost/?id=${post._id}`}>
											<PencilSVG />
										</AnchorLink>
										<div data-id={post._id} data-name={post.title} onClick={e => handleOpenPopup(e)}>
											<TrashSVG />
										</div>
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

			<Popup
				popupRef={popupRef}
				handleClosePopup={handleClosePopup}
				handleDelete={handleDeletePost}
				popUpMessage={popUpMessage}>
				{!popUpMessage && (
					<div className={styles.popupInfo}>
						<span>
							Post Title: <span>{postData.postTitle}</span>
						</span>
						<span>
							Post Id: <span>{postData.postId}</span>
						</span>
					</div>
				)}
			</Popup>
		</div>
	)
}

export default ListOfPosts
