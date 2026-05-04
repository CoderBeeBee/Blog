import { ProfileSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import type { UsersProps } from '../../../types/types'
import styles from './ListOfUsers.module.scss'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'
import useDebounce from '../../../hooks/useDebounce'
import { noChevron, rowsNumbers, theadUsers } from '../../../utils/data'
import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import { useAdminDeleteUserMutation, useFetchUserByLimitQuery } from '../../../slices/api/userApi'
import timePass from '../../../hooks/timePass'
import Popup from '../../atoms/Popup/Popup'
import NotificationNew from '../../atoms/NotificationNew/NotificationNew'
import { ChevronDownSVG } from '../../../assets/icons/Icons'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import CreateButton from '../../atoms/CreateButton/CreateButton'
import FilterButton from '../../atoms/FilterButton/FilterButton'
import useFilters from '../../../hooks/useFilters'
import CheckMark from '../../atoms/Checkmark/CheckMark'
import useCheckMark from '../../../hooks/useCheckMark'
import dateConverter from '../../../hooks/dateConverter'
import DeleteAllButton from '../../atoms/DeleteAllButton/DeleteAllButton'

import useOpenClosePopup from '../../../hooks/useOpenClosePopup'
import useSort from '../../../hooks/useSort'
import useWindowSize from '../../../hooks/useWindowSize'
import longDateConverter from '../../../hooks/longDateConverter'

const ListOfUsers = () => {
	const { widthLess900, widthLess700 } = useWindowSize()
	
	const filtersOption = ['last Login']
	const { handleCheckMark, checked, handleCheckMarkAll, isCheckedAll, handleClearCheckedSet } = useCheckMark()
	const { filters, setFilters } = useFilters()
	const { openPopup, popUpMessage, setPopUpMessage, handleOpenPopup, handleClosePopup } = useOpenClosePopup()
	const { sort, listRef, handleSetSort, focusedChevron,handleResetSort } = useSort()
	const activeColumn = sort.sortBy === 'last Login' ? 'last Login' : 'created At'
	const [rows, setRows] = useState<number>(10)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)
	const [adminDeleteUser] = useAdminDeleteUserMutation()
	const { data } = useFetchUserByLimitQuery({
		limit: rows,
		page: currentPage,
		search: search,
		sortBy: sort.sortBy,
		order: sort.order,
	})

	const { users = [], totalPages = 1, total = 1 } = data ?? {}

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

	const handleDeleteUser = async () => {
		try {
			const res = await adminDeleteUser([...checked]).unwrap()

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
		const usersID = users.map((user: UsersProps) => user._id)

		handleCheckMarkAll(usersID)
	}
	// if (isFetching) return <Loader />
	return (
		<div className={styles.listContainer}>
			<Breadcrumbs />
			<div className={styles.listWrapperTools}>
				<div className={styles.listTools}>
					<CreateButton href="/admin/users/adduser" ariaLabel="Create new user" className={styles.createNew} />
					<TabelSearch handleSetInputValue={handleSetInputValue} />
					<FilterButton setFilters={setFilters} handleResetSort={handleResetSort}/>
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
							{theadUsers
								.filter(f => !['created At', 'last Login'].includes(f) || f === activeColumn)
								.map((item, index) => {
									if (!noChevron.includes(item)) {
										if (
											(widthLess900 && ['created At', 'last Login'].includes(item)) ||
											(widthLess700 && item === 'email')
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
						{users &&
							users?.map((user: UsersProps, index: number) => {
								const isChecked = checked.has(user._id)

								return (
									<tr key={index} className={`${styles.tr} `}>
										<td className={styles.td} onClick={() => handleCheckMark(user._id)}>
											<CheckMark isChecked={isChecked} />
										</td>
										<td className={styles.td}>{index + 1}</td>
										<td className={styles.td}>
											<img src={user.avatar.src} alt="Avatar" loading="lazy" />
										</td>
										<td className={styles.td}>
											<AnchorLink
												ariaLabel="Username"
												className={styles.listUserName}
												href={`admin/users/profile/${user._id}`}>
												{user.name}
											</AnchorLink>
											{timePass(user.createdAt, 7) && <NotificationNew />}
										</td>

										{!widthLess700 && <td className={`${styles.td} ${styles.email}`}>{user.email}</td>}
										{!widthLess900 &&
											(activeColumn === 'last Login' ? (
												<td className={styles.td}>
													{user.lastLogin !== null
														? new Date(user.lastLogin).toLocaleDateString(...longDateConverter())
														: '-----'}
												</td>
											) : (
												<td className={styles.td}>{new Date(user.createdAt).toLocaleDateString(...dateConverter())}</td>
											))}
										<td className={styles.td}>{user.isVerified.toString().toUpperCase()}</td>

										<td className={styles.td}>
											{new Date(user.lastLogin) > new Date(user.lastLogout) ? (
												<span className={styles.activeUser}>Active</span>
											) : (
												<span className={styles.inActiveUser}>Inactive</span>
											)}
										</td>

										<td className={styles.td}>
											<AnchorLink
												title="Profile"
												aria-label="Profile"
												className={styles.detailsButton}
												href={`/admin/users/profile/${user._id}`}>
												<ProfileSVG />
											</AnchorLink>
										</td>
									</tr>
								)
							})}
					</tbody>
				</table>
			</div>

			{openPopup && (
				<Popup handleClosePopup={handleClosePopup} handleDelete={handleDeleteUser} popUpMessage={popUpMessage}>
					{!popUpMessage && (
						<div className={styles.popupInfo}>
							<p className={styles.popupTitle}>
								{checked.size} {checked.size > 1 ? 'Users' : 'User'}:
							</p>
							<div className={styles.popupDeletedList}>
								{[...checked].map((userId, index) => {
									const user = users.find((user: UsersProps) => user._id === userId)
									return (
										<span key={userId}>
											<span>{index + 1}.</span> <span>{user?.name}</span>
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

export default ListOfUsers
