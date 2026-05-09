import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_URL
const TAGS_URL = import.meta.env.VITE_TAGS_URL

export interface AllTagsProps {
	_id: string
	name: string
	createdAt: string
	author: {
		_id: string
		name: string
	}
}
interface TagProps {
	allTags: AllTagsProps[]
	totalPages: number
	total: number
}

export const tagsApi = createApi({
	reducerPath: 'tag',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	tagTypes: ['Tag'],
	endpoints: builder => ({
		createTag: builder.mutation({
			query: ({ tag }) => ({
				url: `${TAGS_URL}/create-tag`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { tag },
			}),
			invalidatesTags: () => [{ type: 'Tag' }],
		}),

		fetchAllTags: builder.query<
			TagProps,
			{ limit: number; page: number; search: string; sortBy: string; order: string }
		>({
			query: params => {
				const queryString = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${TAGS_URL}/?${queryString}`
			},
			providesTags: () => [{ type: 'Tag' }],
		}),
		deleteTag: builder.mutation({
			query: tagId => ({
				url: `${TAGS_URL}/${tagId}`,
				method: 'DELETE',
			}),
			invalidatesTags: () => [{ type: 'Tag' }],
		}),
	}),
})

export const { useCreateTagMutation, useFetchAllTagsQuery, useDeleteTagMutation } = tagsApi
