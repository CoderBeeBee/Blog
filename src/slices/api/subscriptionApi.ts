import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_URL
const SUB_URL = import.meta.env.VITE_SUB_URL

interface SubscribersProps {
	_id: string
	email: string
	isVerified: boolean
	createdAt: string
	lastSent: string
	nextSent: string
}
interface SubscriberProps {
	subscribers: SubscribersProps[]
	totalPages: number
	total: number
	done?: false
	id?: string
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
		fetchSubscribers: builder.query<SubscriberProps, fetchSubscribersProps>({
			query: params => {
				const queryParams = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${SUB_URL}/?${queryParams}`
			},
			async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
				await cacheDataLoaded

				const es = new EventSource(`${API_URL}${SUB_URL}/stream-delete`)

				es.onmessage = e => {
					const data = JSON.parse(e.data)

					updateCachedData(draft => {
						if (data.done) draft.done = data.done

						if (data.id) draft.id = data.id
					})
					setTimeout(() => {
						updateCachedData(draft => {
							draft.subscribers = draft.subscribers.filter(sub => sub._id !== data.id)
							draft.total -= 1
						})
					}, 500)
				}

				await cacheEntryRemoved
				es.close()
			},
			providesTags: () => [{ type: 'SUB' }],
		}),
		deleteSubscriber: builder.mutation({
			query: subIds => ({
				url: `${SUB_URL}/delete`,
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
				body: { subIds },
			}),
			// invalidatesTags: () => [{ type: 'SUB' }],
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
