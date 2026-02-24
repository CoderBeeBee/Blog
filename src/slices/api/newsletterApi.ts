import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_URL = import.meta.env.VITE_API_URL
const NEWSLETTER_URL = import.meta.env.VITE_NEWSLETTER_URL

export const newsletterApi = createApi({
	reducerPath: 'news',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	endpoints: builder => ({
		newsletterCampaign: builder.mutation({
			query: ({ newsletter }) => ({
				url: `${NEWSLETTER_URL}/create`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { newsletter },
			}),
		}),
        fetchNewsletterCampaign:builder.query({
            query:()=>`${NEWSLETTER_URL}`
        })
	}),
})

export const { useNewsletterCampaignMutation,useFetchNewsletterCampaignQuery } = newsletterApi
