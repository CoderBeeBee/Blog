import { useLocation } from 'react-router'
import type { ArticleContentProps } from '../types/types'

import { createContext, type ReactNode } from 'react'

import Loader from '../components/atoms/loader/Loader'
import { useFetchPostByIdQuery } from '../slices/api/postApi'

interface SinglePostProviderProps {
	children: ReactNode
}

const SinglePostContext = createContext<ArticleContentProps | null>(null)

const SinglePostProvider = ({ children }: SinglePostProviderProps) => {
	const { search } = useLocation()
	const query = new URLSearchParams(search)

	const postId = query.get('id')

	const { data, isFetching } = useFetchPostByIdQuery(postId, { skip: !postId })
	
	if (isFetching) return <Loader />

	return <SinglePostContext value={data}>{children}</SinglePostContext>
}

export { SinglePostContext, SinglePostProvider }
