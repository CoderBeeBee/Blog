import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_URL
const TAGS_URL = import.meta.env.VITE_TAGS_URL

interface TagProps {
	_id: string
	name: string
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

		fetchAllTags: builder.query<TagProps[], void>({
			query: () => `${TAGS_URL}`,
			providesTags: () => [{ type: 'Tag' }],
		}),
		deleteTag: builder.mutation({
			query: tagId => ({
				url: `${TAGS_URL}/${tagId}`,
                method:'DELETE'
			}),
			invalidatesTags: () => [{ type: 'Tag' }],
		}),
	}),
})

export const { useCreateTagMutation, useFetchAllTagsQuery, useDeleteTagMutation } = tagsApi
