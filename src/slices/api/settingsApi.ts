import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const GENERAL_URL = import.meta.env.VITE_GENERAL_URL
const API_URL = import.meta.env.VITE_API_URL
export const generalApi = createApi({
	reducerPath: 'settings',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	tagTypes: ['SAVE'],
	endpoints: builder => ({
		basicSettings: builder.mutation({
			query: ({ basic }) => ({
				url: `${GENERAL_URL}`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { basic },
			}),
			invalidatesTags: () => [{ type: 'SAVE' }],
		}),
		updateSecuritySettings: builder.mutation({
			query: ({ security }) => ({
				url: `${GENERAL_URL}/update/security`,
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: { security },
			}),
			invalidatesTags: () => [{ type: 'SAVE' }],
		}),
		updateInteractionSettings: builder.mutation({
			query: ({ interactions }) => ({
				url: `${GENERAL_URL}/update/interactions`,
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: { interactions },
			}),
			invalidatesTags: () => [{ type: 'SAVE' }],
		}),
		updatePostsSettings: builder.mutation({
			query: ({ posts }) => ({
				url: `${GENERAL_URL}/update/posts`,
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: { posts },
			}),
			invalidatesTags: () => [{ type: 'SAVE' }],
		}),
		updateAnalyticsSettings: builder.mutation({
			query: ({ analytics }) => ({
				url: `${GENERAL_URL}/update/analytics`,
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: { analytics },
			}),
			invalidatesTags: () => [{ type: 'SAVE' }],
		}),
		updateDifferentSettings: builder.mutation({
			query: ({ different }) => ({
				url: `${GENERAL_URL}/update/different`,
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: { different },
			}),
			invalidatesTags: () => [{ type: 'SAVE' }],
		}),
		updateIntegrationsSettings: builder.mutation({
			query: ({ integrations }) => ({
				url: `${GENERAL_URL}/update/integrations`,
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: { integrations },
			}),
			invalidatesTags: () => [{ type: 'SAVE' }],
		}),
		fetchSettings: builder.query({
			query: () => `${GENERAL_URL}`,
			providesTags: () => [{ type: 'SAVE' }],
		}),
	}),
})

export const {
	useBasicSettingsMutation,
	useFetchSettingsQuery,
	useUpdateSecuritySettingsMutation,
	useUpdateInteractionSettingsMutation,
	useUpdatePostsSettingsMutation,
	useUpdateAnalyticsSettingsMutation,
	useUpdateDifferentSettingsMutation,
	useUpdateIntegrationsSettingsMutation,
} = generalApi
