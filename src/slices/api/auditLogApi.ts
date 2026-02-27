import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_URL
const AUDIT_URL = import.meta.env.VITE_AUDIT_URL

export const auditlogApi = createApi({
	reducerPath: 'audit',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	endpoints: builder => ({
		fetchAuditLogs: builder.query({
			query: params => {
				const searchQuery = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${AUDIT_URL}?${searchQuery}`
			},
		}),
	}),
})

export const { useFetchAuditLogsQuery } = auditlogApi
