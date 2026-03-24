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
	action?: string
}

type FetchPostsResponse = {
	posts: ExtendedArticleContentProps[]
	totalPages: number
	total: number
}

export const postApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	tagTypes: ['Posts'],
	endpoints: builder => ({
		createPost: builder.mutation({
			query: updatedData => ({
				url: `${POSTS_URL}`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: updatedData,
			}),
			invalidatesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),
		updatePost: builder.mutation({
			query: ({ postId, updatedData }) => ({
				url: `${POSTS_URL}/update/${postId}`,
				method: 'PUT',
				headers: { 'Content-type': 'application/json' },
				body: { updatedData },
			}),
			invalidatesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),

		deletePosts: builder.mutation({
			query: postsId => ({
				url: `${POSTS_URL}/delete`,
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
				body: { postsId },
			}),
			invalidatesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),

		publishPost: builder.mutation({
			query: postId => ({
				url: `${POSTS_URL}/publish-post/${postId}`,
				method: 'PUT',
				headers: { 'Content-type': 'application/json' },
			}),
			invalidatesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),
		fetchHeroPostLimit: builder.query({
			query: () => `${POSTS_URL}/hero-limit`,
			providesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),
		fetchPostPerPage: builder.query({
			query: ({ page }) => {
				const params = new URLSearchParams()

				if (page !== undefined) params.set('page', page)

				return `${POSTS_URL}/limit/?${params.toString()}`
			},
			providesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),

		fetchPostsByCategory: builder.query({
			query: params => {
				const queryString = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${POSTS_URL}/category/?${queryString}`
			},
			providesTags: (_result, _error, arg) => [
				{ type: 'Posts', id: `${arg.category}-${arg.page}` },
				{ type: 'Posts', id: 'LIST' },
			],
		}),
		fetchPostCreatedAt: builder.query({
			query: postId => `${POSTS_URL}/createdAt/${postId}`,
			providesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),
		fetchPostsByLimit: builder.query<FetchPostsResponse, FetchPostsParams>({
			query: params => {
				const queryString = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${POSTS_URL}/paginated/?${queryString}`
			},
			providesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),

		fetchPostById: builder.query({
			query: postId => `${POSTS_URL}/${postId}`,
			providesTags: () => [{ type: 'Posts', id: 'LIST' }],
		}),

		searchPost: builder.query({
			query: query => `${POSTS_URL}/search/?query=${query}`,
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

	useDeletePostsMutation,
	usePublishPostMutation,

	useLazySearchPostQuery,
	useUpdatePostMutation,
	useFetchPostsByCategoryQuery,
} = postApi
