import type { UsersProps } from '../../../types/types'
import styles from './AdminList.module.scss'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'

import useDebounce from '../../../hooks/useDebounce'

import { rowsNumbers } from '../../../utils/data'

import TabelPagination from '../../modules/TabelPagination/TabelPagination'
import TabelSearch from '../../modules/TabelSearch/TabelSearch'
import { useAdminDeleteUserMutation, useFetchAdminsAndModeratorsQuery } from '../../../slices/api/userApi'
import Popup from '../../atoms/Popup/Popup'

import longDateConverter from '../../../hooks/longDateConverter'
import { ChevronDownSVG } from '../../../assets/icons/Icons'
import Breadcrumbs from '../../atoms/Breadcrumbs/Breadcrumbs'
import CreateButton from '../../atoms/CreateButton/CreateButton'
import FilterButton from '../../atoms/FilterButton/FilterButton'

import useCheckMark from '../../../hooks/useCheckMark'
import useOpenClosePopup from '../../../hooks/useOpenClosePopup'
import useFilters from '../../../hooks/useFilters'
import useSort from '../../../hooks/useSort'
import DeleteAllButton from '../../atoms/DeleteAllButton/DeleteAllButton'
import CheckMark from '../../atoms/Checkmark/CheckMark'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const AdminList = () => {
	const filtersOption = ['name', 'created At', 'last Login', 'total posts', 'total comments']
	const { handleCheckMark, checked, isCheckedAll, handleClearCheckedSet } = useCheckMark()
	const { filters, setFilters } = useFilters()
	const { openPopup, popUpMessage, setPopUpMessage, handleOpenPopup, handleClosePopup } = useOpenClosePopup()
	const { sort, listRef, handleSetSort, focusedChevron, handleResetSort } = useSort()

	const [rows, setRows] = useState<number>(10)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [adminDeleteUser] = useAdminDeleteUserMutation()

	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)

	const { data } = useFetchAdminsAndModeratorsQuery({
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

	return (
		<div className={styles.listContainer}>
			<Breadcrumbs />
			<div className={styles.listWrapperTools}>
				<div className={styles.listTools}>
					<CreateButton href="/admin/users/adduser" ariaLabel="Create new user" className={styles.createNew} />
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
				{users &&
					users?.map((user: UsersProps, index: number) => {
						const isChecked = checked.has(user._id)
						
						return (
							<div key={index} className={`${styles.adminCard} `}>
								<div className={styles.adminCardHeader}>
									{user.role !== 'Admin' && (
										<div onClick={() => handleCheckMark(user._id)} className={styles.checkedBox}>
											<CheckMark isChecked={isChecked} />
										</div>
									)}
									<div className={styles.id}>Id: {index + 1}</div>
									<div className={styles.isActive}>
										{new Date(user.lastLogin) > new Date(user.lastLogout) ? (
											<span className={styles.activeUser}>Active</span>
										) : (
											<span className={styles.inactiveUser}>Inactive</span>
										)}
									</div>
								</div>
								<div className={styles.adminCardBody}>
									<div className={styles.adminAvatar}>
										<img src={user.avatar.src} alt="Avatar" />
									</div>

									<div className={styles.adminCardInfo}>
										<div className={`${styles.info}`}>
											Name:{' '}
											<AnchorLink className={styles.user} href={`/admin/users/profile/${user._id}`}>
												{user.name}
											</AnchorLink>
										</div>

										<div className={styles.info}>Email: {user.email}</div>
										<div className={styles.info}>Role: {user.role}</div>
										<div className={styles.info}>
											Date created: {new Date(user.createdAt).toLocaleDateString(...longDateConverter())}
										</div>

										<div className={styles.info}>
											Last login:{' '}
											{user.lastLogin ? new Date(user.lastLogin).toLocaleString(...longDateConverter()) : '-----'}
										</div>
										<div className={styles.info}>Total posts: {user.postCount}</div>
										<div className={styles.info}>Total comments: {user.commentsCount}</div>
									</div>
								</div>
							</div>
						)
					})}
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

export default AdminList
