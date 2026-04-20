import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { SearchProps } from '../../../types/types'
import styles from './SearchContainer.module.scss'
import CloseButton from '../../atoms/CloseButton/CloseButton'
import { useDispatch } from 'react-redux'
import { setIsOpen } from '../../../slices/themeSlice'
import useDebounce from '../../../hooks/useDebounce'
import { useLazySearchPostQuery } from '../../../slices/api/postApi'
import AnchorLink from '../../atoms/AnchorLink/AnchorLink'
import createUrl from '../../../hooks/createUrl'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

interface DataSearchProps {
	_id: string
	title: string
	categories: string[]
	seo: {
		slug: string
		metaTitle: string
		metaDescription: string
	}
}

const SearchContainer = ({ isOpen }: SearchProps) => {
	const searchContainerRef = useRef<HTMLDivElement>(null)
	const searchRef = useRef<HTMLDivElement>(null)
	const searchListRef = useRef<HTMLDivElement>(null)
	const [value, setValue] = useState<string>('')
	const [errorMessage, setErrorMessage] = useState<string>('')
	const dispatch = useDispatch()

	const debouncedValue = useDebounce(value, 500)
	const [searchPost, { data, error, reset }] = useLazySearchPostQuery()
	useEffect(() => {
		if (typeof error === 'object' && error !== null) {
			const fetchError = error as FetchBaseQueryError
			const errorMessage =
				fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
					? (fetchError.data.message as string)
					: 'An unexpected error has occured'

			setErrorMessage(errorMessage)
			reset()
		}
	}, [error, reset, setErrorMessage])

	useEffect(() => {
		if (data) {
			setErrorMessage('')
		}
	}, [data])

	useEffect(() => {
		if (debouncedValue) {
			searchPost(debouncedValue)
		} else {
			reset()
		}
	}, [debouncedValue, searchPost, reset])
	useEffect(() => {
		setTimeout(() => {
			searchContainerRef.current?.classList.add(styles.fadeIn)
		}, 50)
		setTimeout(() => {
			searchRef.current?.classList.add(styles.show)
		}, 300)
	}, [isOpen])

	const handleClose = () => {
		setTimeout(() => {
			searchRef.current?.classList.remove(styles.show)
			searchListRef.current?.classList.remove(styles.fadeOut)
		}, 50)
		setTimeout(() => {
			searchContainerRef.current?.classList.remove(styles.fadeIn)
		}, 600)

		setTimeout(() => {
			dispatch(setIsOpen(false))
		}, 1000)
	}

	const searchInput = (e: FormEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement

		setValue(target.value.trim())
	}

	useEffect(() => {
		if (debouncedValue) {
			searchListRef.current?.classList.add(styles.fadeOut)

			setTimeout(() => {
				searchListRef.current?.classList.add(styles.height)
			}, 50)
		} else {
			searchListRef.current?.classList.remove(styles.fadeOut)
			searchListRef.current?.classList.remove(styles.height)
		}
	}, [debouncedValue])

	const searchBlur = () => {
		searchListRef.current?.classList.remove(styles.fadeOut)
		searchListRef.current?.classList.remove(styles.height)
	}

	const searchFocus = (e: FormEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		const query = target.value.trim()
		if (query === ' ') return
		if (query) {
			searchListRef.current?.classList.add(styles.fadeOut)
			setTimeout(() => {
				searchListRef.current?.classList.add(styles.height)
			}, 50)
		}
	}

	return (
		<div ref={searchContainerRef} className={styles.container}>
			<div ref={searchRef} className={`${styles.searchContainer} `}>
				<div className="row">
					<div className={styles.elementSearchContainer}>
						<form className={styles.elementSearchForm}>
							<input
								value={value}
								name="search"
								type="text"
								placeholder="Search for..."
								className={styles.input}
								autoComplete="off"
								onInput={e => searchInput(e)}
								onBlur={() => searchBlur()}
								onFocus={e => searchFocus(e)}
							/>
						</form>
						<div ref={searchListRef} className={`${styles.elementSearchList}`}>
							{data &&
								data.map((item: DataSearchProps) => {
									const url = createUrl({ slug: item.seo.slug, _id: item._id })

									return (
										<AnchorLink
											key={item._id}
											handleClose={handleClose}
											className={styles.elementSearchListLink}
											href={url}>
											{item.title}
										</AnchorLink>
									)
								})}

							{errorMessage && <span className={styles.elementSearchListLink}>{errorMessage}</span>}
						</div>
					</div>

					<CloseButton styles={styles} handleClose={handleClose} />
				</div>
			</div>
		</div>
	)
}

export default SearchContainer
