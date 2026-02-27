import { useState } from 'react'
import useDebounce from '../../../../../hooks/useDebounce'
import { adminAttempActions } from '../../../../../utils/data'

import styles from './AdminAttemptsTemplate.module.scss'
import { useFetchSecurityAttemptsQuery } from '../../../../../slices/api/securityApi'
import Attempts from '../../../../organism/Attempts/Attempts'

const AdminAttempsTemplate = () => {
	const [action, setAction] = useState<string>('')
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

	const { data } = useFetchSecurityAttemptsQuery(
		{
			limit: rows,
			page: currentPage,
			search: search,
			sortBy: sort.sortBy,
			order: sort.order,
			action: action,
			source: 'ADMIN',
		},
		{ refetchOnMountOrArgChange: true },
	)

	const { attempts, total, totalPages } = data ? data : []
	return (
		<div className={styles.adminAttemptsContainer}>
			<Attempts
				attempts={attempts}
				setAction={setAction}
				setInputValue={setInputValue}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				attempActions={adminAttempActions}
				setRows={setRows}
				setStart={setStart}
				setEnd={setEnd}
				setSort={setSort}
				totalPages={totalPages}
				total={total}
				rows={rows}
				start={start}
				end={end}>
				Admin Attempts
			</Attempts>
		</div>
	)
}

export default AdminAttempsTemplate
