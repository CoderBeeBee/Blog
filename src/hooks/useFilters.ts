import { useState } from 'react'

const useFilters = () => {
	const [filters, setFilters] = useState<boolean>(false)

	return {
		setFilters,
		filters,
	}
}

export default useFilters
