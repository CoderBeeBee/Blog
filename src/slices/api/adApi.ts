import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'

const API_URL = import.meta.env.VITE_API_URL
const AD_URL = import.meta.env.VITE_AD_URL

interface adsProps {
	client: string
	slots: { [key: string]: Record<string, string | boolean> }
}

export const adApi = createApi({
	reducerPath: 'ad',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	endpoints: builder => ({
		createAds: builder.mutation<Record<string, string>, adsProps>({
			query: ( ads ) => ({
				url: `${AD_URL}/create`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { ads },
			}),
		}),
        fetchAds:builder.query({
            query:()=> `${AD_URL}`
        })
	}),
})

export const { useCreateAdsMutation,useFetchAdsQuery } = adApi
