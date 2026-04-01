import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CommentsDataProps } from '../../types/types'
const API_URL = import.meta.env.VITE_API_URL
const COMMENTS_URL = import.meta.env.VITE_COMMENTS_URL

export const commentsApi = createApi({
	reducerPath: 'comment',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	tagTypes: ['Comments'],
	endpoints: builder => ({
		fetchLiveComments: builder.query<CommentsDataProps[], string>({
			query: postId => `${COMMENTS_URL}/${postId}`,

			async onCacheEntryAdded(postId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
				await cacheDataLoaded

				const es = new EventSource(`${API_URL}${COMMENTS_URL}/stream?postId=${postId}`)

				es.addEventListener('comment', e => {
					const { type, comment, id } = JSON.parse(e.data)

					updateCachedData(draft => {
						if (type === 'insert') draft.push(comment)
						if (type === 'update') {
							const idx = draft.findIndex(c => c._id === comment._id)
							if (idx !== -1) draft[idx] = comment
						}
						if (type === 'delete') {
							// return draft.filter(c => !ids.includes(c._id))
							return draft.filter(c => c._id !== id)
						}
					})
				})

				await cacheEntryRemoved
				es.close()
			},
		}),
		createComment: builder.mutation({
			query: ({ postId, comment, parentId }) => ({
				url: `${COMMENTS_URL}/${postId}`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { comment, parentId },
			}),
			invalidatesTags: () => [{ type: 'Comments', id: 'LIST' }],
		}),
		updateComment: builder.mutation({
			query: ({ commentId, comment }) => ({
				url: `${COMMENTS_URL}/${commentId}`,
				method: 'PUT',
				headers: { 'Content-type': 'application/json' },
				body: { comment },
			}),
			invalidatesTags: () => [{ type: 'Comments', id: 'LIST' }],
		}),
		deleteComment: builder.mutation({
			query: commentsId => ({
				url: `${COMMENTS_URL}`,
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
				body: { commentsId },
			}),
			invalidatesTags: () => [{ type: 'Comments', id: 'LIST' }],
		}),

		fetchAllComments: builder.query({
			query: params => {
				const queryString = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${COMMENTS_URL}/?${queryString}`
			},
			providesTags: () => [{ type: 'Comments', id: 'LIST' }],
		}),
	}),
})

export const {
	useCreateCommentMutation,
	// useFetchCommentsQuery,
	useUpdateCommentMutation,
	useDeleteCommentMutation,
	useFetchAllCommentsQuery,
	useFetchLiveCommentsQuery,
} = commentsApi
