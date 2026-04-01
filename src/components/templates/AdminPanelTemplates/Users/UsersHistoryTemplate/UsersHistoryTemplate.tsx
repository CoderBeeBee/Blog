import styles from './UsersHistoryTemplate.module.scss'
import { useState } from 'react'
import ChangeHistory from '../../../../organism/ChangeHistory/ChangeHistory'
import useDebounce from '../../../../../hooks/useDebounce'
import { useFetchAuditLogsQuery } from '../../../../../slices/api/auditLogApi'
import { useLocation } from 'react-router'
import useSort from '../../../../../hooks/useSort'
const UsersHistoryTemplate = () => {
	const { pathname } = useLocation()
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [rows, setRows] = useState<number>(10)
	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)
	const { sort, listRef, handleSetSort, focusedChevron, handleResetSort } = useSort()

	const href = `${pathname}/details`
	const { data } = useFetchAuditLogsQuery(
		{
			limit: rows,
			page: currentPage,
			search: search,
			sortBy: sort.sortBy,
			order: sort.order,
			entityType: 'User',
		},
		{ refetchOnMountOrArgChange: true },
	)

	const { auditlogs, total, totalPages } = data ? data : []
	return (
		<div className={styles.usersHistoryContainer}>
			<ChangeHistory
				auditlogs={auditlogs}
				setInputValue={setInputValue}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				setRows={setRows}
				setStart={setStart}
				setEnd={setEnd}
				handleSetSort={handleSetSort}
				handleResetSort={handleResetSort}
				focusedChevron={focusedChevron}
				listRef={listRef}
				totalPages={totalPages}
				total={total}
				rows={rows}
				start={start}
				end={end}
				href={href}></ChangeHistory>
		</div>
	)
}

export default UsersHistoryTemplate
