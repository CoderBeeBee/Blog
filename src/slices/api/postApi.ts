import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ExtendedArticleContentProps } from '../../types/types'
const API_URL = import.meta.env.VITE_API_URL
const POSTS_URL = import.meta.env.VITE_POSTS_URL

type FetchPostsParams = {
	page?: number
	limit?: number
	search?: string
	sortBy?: string
	order?: string
	// category?: string
	action?:string
}

type FetchPostsResponse = {
	posts: ExtendedArticleContentProps[]
	totalPages: number
	total: number
}

export const postApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	tagTypes: ['POSTS'],
	endpoints: builder => ({
		fetchHeroPostLimit: builder.query({
			query: () => `${POSTS_URL}/hero-limit`,
			providesTags: () => [{ type: 'POSTS' }],
		}),
		fetchPostPerPage: builder.query({
			query: ({ page }) => {
				const params = new URLSearchParams()

				if (page !== undefined) params.set('page', page)

				return `${POSTS_URL}/limit/?${params.toString()}`
			},
			providesTags: () => [{ type: 'POSTS' }],
		}),

		fetchPostsByCategory: builder.query({
			query: params => {
				const queryString = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${POSTS_URL}/category/?${queryString}`
			},
			providesTags: (_result, _error, arg) => [{ type: 'POSTS', id: `${arg.category}-${arg.page}` }],
		}),
		fetchPostCreatedAt: builder.query({
			query: postId => `${POSTS_URL}/createdAt/${postId}`,
			providesTags: () => [{ type: 'POSTS' }],
		}),
		fetchPostsByLimit: builder.query<FetchPostsResponse, FetchPostsParams>({
			query: params => {
				const queryString = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${POSTS_URL}/paginated/?${queryString}`
			},
			providesTags: () => [{ type: 'POSTS' }],
		}),

		fetchPostById: builder.query({
			query: postId => `${POSTS_URL}/${postId}`,
			providesTags: () => [{ type: 'POSTS' }],
		}),

		searchPost: builder.query({
			query: query => `${POSTS_URL}/search/?query=${query}`,
			
		}),

		createPost: builder.mutation({
			query: updatedData => ({
				url: `${POSTS_URL}`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: updatedData,
			}),
			invalidatesTags: () => [{ type: 'POSTS' }],
		}),
		updatePost: builder.mutation({
			query: ({ postId, updatedData }) => ({
				url: `${POSTS_URL}/update/${postId}`,
				method: 'PUT',
				headers: { 'Content-type': 'application/json' },
				body: { updatedData },
			}),
			invalidatesTags: () => [{ type: 'POSTS' }],
		}),

		deletePost: builder.mutation({
			query: postId => ({
				url: `${POSTS_URL}/delete/${postId}`,
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
			}),
			invalidatesTags: () => [{ type: 'POSTS' }],
		}),

		publishPost: builder.mutation({
			query: postId => ({
				url: `${POSTS_URL}/publish-post/${postId}`,
				method: 'PUT',
				headers: { 'Content-type': 'application/json' },
			}),
			invalidatesTags: () => [{ type: 'POSTS' }],
		}),
	}),
})

export const {
	useFetchPostPerPageQuery,
	useFetchHeroPostLimitQuery,
	useCreatePostMutation,
	useFetchPostByIdQuery,
	useFetchPostsByLimitQuery,
	useFetchPostCreatedAtQuery,

	useDeletePostMutation,
	usePublishPostMutation,
	
	useLazySearchPostQuery,
	useUpdatePostMutation,
	useFetchPostsByCategoryQuery,
} = postApi
