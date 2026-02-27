import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_URL
const SECURITY_URL = import.meta.env.VITE_SECURITY_URL

export const securityApi = createApi({
	reducerPath: 'atempt',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	endpoints: builder => ({
		fetchSecurityAttempts: builder.query({
			query: (params) => {
				const queryString = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()


				return `${SECURITY_URL}?${queryString}`
			},
		}),
	}),
})


export const {useFetchSecurityAttemptsQuery} = securityApi