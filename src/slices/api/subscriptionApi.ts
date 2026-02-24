import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_URL
const SUB_URL = import.meta.env.VITE_SUB_URL
export const subscriptionApi = createApi({
	reducerPath: 'sub',
	baseQuery: fetchBaseQuery({ baseUrl: API_URL,credentials:'include' }),
	endpoints: builder => ({
		subscription: builder.mutation({
			query: ({ email }) => ({
				url: `${SUB_URL}/`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { email },
			}),
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


	}),
})

export const { useSubscriptionMutation,useVerifySubscriptionQuery,useConfirmUnsubscribeQuery } = subscriptionApi
