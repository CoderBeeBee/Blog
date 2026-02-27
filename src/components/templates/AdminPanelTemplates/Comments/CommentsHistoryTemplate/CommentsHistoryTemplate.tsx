import styles from './CommentsHistoryTemplate.module.scss'
import { useState } from 'react'
import ChangeHistory from '../../../../organism/ChangeHistory/ChangeHistory'
import useDebounce from '../../../../../hooks/useDebounce'
import { useFetchAuditLogsQuery } from '../../../../../slices/api/auditLogApi'
const CommentsHistoryTemplate = () => {
	const [inputValue, setInputValue] = useState<string>('')
	const search = useDebounce(inputValue, 500)
	const [currentPage, setCurrentPage] = useState<number>(1)

	const [rows, setRows] = useState<number>(10)
	const [start, setStart] = useState<number>(0)
	const [end, setEnd] = useState<number>(0)

	const [sort, setSort] = useState({
		sortBy: '',
		order: '',
	})

	const { data } = useFetchAuditLogsQuery(
		{
			limit: rows,
			page: currentPage,
			search: search,
			sortBy: sort.sortBy,
			order: sort.order,
			entityType: 'Comment',
		},
		{ refetchOnMountOrArgChange: true },
	)

	
	const { auditlogs, total, totalPages } = data ? data : []
	return (
		<div className={styles.commentsHistoryContainer}>
			<ChangeHistory
				auditlogs={auditlogs}
				setInputValue={setInputValue}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				setRows={setRows}
				setStart={setStart}
				setEnd={setEnd}
				setSort={setSort}
				totalPages={totalPages}
				total={total}
				rows={rows}
				start={start}
				end={end}>
				Comment History
			</ChangeHistory>
		</div>
	)
}

export default CommentsHistoryTemplate
