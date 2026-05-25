import { useEffect, useState } from 'react'
import { userAttempActions } from '../../../../../utils/data'

import styles from './UserAttemptsTemplate.module.scss'
import useDebounce from '../../../../../hooks/useDebounce'
import { useFetchSecurityAttemptsQuery } from '../../../../../slices/api/securityApi'
import Attempts from '../../../../organism/Attempts/Attempts'
import useSort from '../../../../../hooks/useSort'

const UserAttemptsTemplate = () => {
	const { listRef, action, sort, setSort, setAction, handleSetSort, focusedChevron, handleResetSort, handleSetAction } =
		useSort()
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [rows, setRows] = useState<number>(10)
	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)

	useEffect(() => {
		if (inputValue === '') {
			setSort({ sortBy: '', order: '' })
			setAction('')
		}
	}, [inputValue, setAction, setSort])
	const { data } = useFetchSecurityAttemptsQuery(
		{
			limit: rows,
			page: currentPage,
			search: search,
			sortBy: sort.sortBy,
			order: sort.order,
			action: action,
			source: 'API',
		},
		{ refetchOnMountOrArgChange: true },
	)

	const { attempts, total, totalPages } = data ? data : []

	return (
		<div className={styles.userAttemptsContainer}>
			<Attempts
				attempts={attempts}
				handleSetSort={handleSetSort}
				handleResetSort={handleResetSort}
				handleSetAction={handleSetAction}
				focusedChevron={focusedChevron}
				setInputValue={setInputValue}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				attempActions={userAttempActions}
				setRows={setRows}
				setStart={setStart}
				setEnd={setEnd}
				totalPages={totalPages}
				total={total}
				rows={rows}
				start={start}
				end={end}
				listRef={listRef}></Attempts>
		</div>
	)
}

export default UserAttemptsTemplate
