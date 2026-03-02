import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_URL
const SUB_URL = import.meta.env.VITE_SUB_URL

interface SubscribersProps {
	subscribers: {
		_id: string
		email: string
		isVerified: boolean
		createdAt: string
		lastSent: string
		nextSent: string
	}[]
	totalPages: number
	total: number
}

interface fetchSubscribersProps {
	limit: number
	page: number
	search: string
	sortBy: string
	order: string
}
export const subscriptionApi = createApi({
	reducerPath: 'sub',
	baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' }),
	tagTypes: ['SUB'],
	endpoints: builder => ({
		subscription: builder.mutation({
			query: ({ email }) => ({
				url: `${SUB_URL}/`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { email },
			}),
			invalidatesTags: () => [{ type: 'SUB' }],
		}),
		verifySubscription: builder.query({
			query: ({ token }) => ({
				url: `${SUB_URL}/verify-subscription?token=${token}`,
			}),
		}),

		confirmUnsubscribe: builder.query({
			query: ({ token }) => ({
				url: `${SUB_URL}/confirm-unsubscribe?token=${token}`,
			}),
		}),
		fetchSubscribers: builder.query<SubscribersProps, fetchSubscribersProps>({
			query: params => {
				const queryParams = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${SUB_URL}/?${queryParams}`
			},
			providesTags: () => [{ type: 'SUB' }],
		}),
		deleteSubscriber: builder.mutation({
			query: ({ subId }) => ({
				url: `${SUB_URL}/${subId}`,
				method: 'DELETE',
			}),
			invalidatesTags: () => [{ type: 'SUB' }],
		}),
	}),
})

export const {
	useSubscriptionMutation,
	useVerifySubscriptionQuery,
	useConfirmUnsubscribeQuery,
	useFetchSubscribersQuery,
	useDeleteSubscriberMutation,
} = subscriptionApi
