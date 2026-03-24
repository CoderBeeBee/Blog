import { type ChangeEvent } from 'react'
import { SearchSVG } from '../../../assets/icons/Icons'
import styles from './TabelSearch.module.scss'
interface TabelSearchProps {
	handleSetInputValue: (e: ChangeEvent<HTMLInputElement>) => void
	className?: string
}

const TabelSearch = ({ handleSetInputValue, className }: TabelSearchProps) => {
	return (
		<div className={`${styles.searchWrapper} ${className ? className : ''}`}>
			<label htmlFor="search" className={styles.searchBox}>
				<input
					id="search"
					className={styles.searchInput}
					type="text"
					placeholder="Search..."
					onChange={e => handleSetInputValue(e)}
				/>
				<button type="button" aria-label="Search button" className={styles.searchBtn}>
					<SearchSVG className={styles.searchIcon} />
				</button>
			</label>
		</div>
	)
}

export default TabelSearch
