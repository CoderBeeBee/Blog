import styles from './Subsribers.module.scss'
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react'
import { useDeleteSubscriberMutation, useFetchSubscribersQuery } from '../../../slices/api/subscriptionApi'
import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import useDebounce from '../../../hooks/useDebounce'
import { rowsNumbers, theadSubscribers } from '../../../utils/data'
import { TrashSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import longDateConverter from '../../../hooks/longDateConverter'
import { ChevronDownSVG } from '../../../assets/icons/Icons'
import Popup from '../../atoms/Popup/Popup'

const Subscribers = () => {
	const subRef = useRef<HTMLDivElement | null>(null)

	const [openPopup, setOpenPopup] = useState<boolean>(false)
	const [popUpMessage, setPopUpMessage] = useState<string>('')
	const [focusedChevron, setFocusedChevron] = useState<string>('')
	const [deleteSubscriber] = useDeleteSubscriberMutation()
	const [rows, setRows] = useState<number>(10)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [subscriber, setSubscriber] = useState({
		email: '',
		subId: '',
	})
	const [sort, setSort] = useState({
		sortBy: '',
		order: '',
	})

	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)

	const { data, refetch } = useFetchSubscribersQuery({
		limit: rows,
		page: currentPage,
		search: search,
		sortBy: sort.sortBy,
		order: sort.order,
	})

	const { subscribers = [], totalPages = 1, total = 1 } = data ?? {}
	
	useEffect(() => {
		refetch()
	}, [data, refetch])

	const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		const value = target.value
		setInputValue(value)
	}

	const handleSetSort = (e: MouseEvent<HTMLDivElement>) => {
		const target = e.currentTarget as HTMLDivElement
		const el = target.dataset.element

		if (!el) return
		if (el !== focusedChevron) {
			setFocusedChevron(el)
		} else {
			setFocusedChevron('')
		}
		subRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
		if (el === 'createdAt' || el === 'lastSent' || el === 'nextSent') {
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
		subRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleOpenPopup = (e: MouseEvent<HTMLDivElement>) => {
		const target = e.currentTarget as HTMLDivElement
		const subId = target.dataset.id
		const email = target.dataset.email
		console.log(subId)
		if (subId && email)
			setSubscriber({
				email,
				subId,
			})
		setOpenPopup(true)
	}
	const handleClosePopup = () => {
		setOpenPopup(false)

		setPopUpMessage('')
	}

	const handleDeleteUser = async () => {
		try {
			if (subscriber.subId) {
				const res = await deleteSubscriber({ subId: subscriber.subId }).unwrap()

				setPopUpMessage(res.message as string)
			}

			refetch()
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<div className={styles.subscribersWrapper}>
			<div className={styles.listWrapperHeader}>
				<h3 className={styles.listTitle}>Subscribers</h3>
				<TabelSearch styles={styles} handleSetInputValue={handleSetInputValue} />
			</div>

			<div ref={subRef} className={styles.listContainer}>
				<div className={styles.tableContainer}>
					<div className={styles.thead}>
						<div className={styles.tr}>
							{theadSubscribers.map((item, index) => {
								if (item !== 'actions') {
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
					</div>
					<div className={styles.tbody}>
						{subscribers &&
							subscribers?.map((sub, index: number) => (
								<div key={index} className={`${styles.tr}`}>
									<div className={styles.td}>{sub.email}</div>
									<div className={styles.td}>{`${sub.isVerified}`}</div>
									<div className={styles.td}>{new Date(sub.createdAt).toLocaleDateString(...longDateConverter())}</div>
									<div className={styles.td}>{new Date(sub.lastSent).toLocaleDateString(...longDateConverter())}</div>
									<div className={styles.td}>{new Date(sub.nextSent).toLocaleDateString(...longDateConverter())}</div>

									<div className={styles.td} data-id={sub._id} data-email={sub.email} onClick={e => handleOpenPopup(e)}>
										<TrashSVG />
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
			<TabelPagination
				setRows={setRows}
				rows={rows}
				rowsNumbers={rowsNumbers}
				start={start}
				end={end}
				total={total}
				handleChangePage={handleChangePage}
			/>
			{openPopup && (
				<Popup handleClosePopup={handleClosePopup} handleDelete={handleDeleteUser} popUpMessage={popUpMessage}>
					{!popUpMessage && (
						<div className={styles.popupInfo}>
							<span>
								Subscriber: <span>{subscriber.email}</span>
							</span>
						</div>
					)}
				</Popup>
			)}
		</div>
	)
}

export default Subscribers
