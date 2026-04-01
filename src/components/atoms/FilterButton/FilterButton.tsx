import type { Dispatch, SetStateAction } from 'react'
import { FilterSVG } from '../../../assets/icons/adminPanelIcons/AdminPanelIcons'
import styles from './FilterButton.module.scss'
interface FilterButtonProps {
	setFilters: Dispatch<SetStateAction<boolean>>
	handleResetSort?: () => void
}

const FilterButton = ({ setFilters, handleResetSort }: FilterButtonProps) => {
	return (
		<button
			type="button"
			title="Filter"
			aria-label="Filter button"
			className={styles.filterButton}
			onClick={() => {
				setFilters(prev => !prev)
				handleResetSort?.()
			}}>
			<FilterSVG />
		</button>
	)
}

export default FilterButton
