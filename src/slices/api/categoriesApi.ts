import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CategoryProps } from '../../types/types'
import type { categoryTypes } from '../../types/categoriesSchema'

const API_URL = import.meta.env.VITE_API_URL
const CATEGORY_URL = import.meta.env.VITE_CATEGORY_URL

export const categoryApi = createApi({
	reducerPath: 'cat',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	tagTypes: ['CATEGORY'],
	endpoints: builder => ({
		createCategory: builder.mutation<{ message: string }, categoryTypes>({
			query: uploadedData => ({
				url: `${CATEGORY_URL}`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: uploadedData,
			}),
			invalidatesTags: () => [{ type: 'CATEGORY' }],
		}),
		updateCategory: builder.mutation<{ message: string }, categoryTypes>({
			query: updateData => ({
				url: `${CATEGORY_URL}/update`,
				method: 'PUT',
				headers: { 'Content-type': 'application/json' },
				body: updateData,
			}),
			invalidatesTags: () => [{ type: 'CATEGORY' }],
		}),
		fetchSingleCategory: builder.query<CategoryProps, string>({
			query: categorySlug => `${CATEGORY_URL}/single/${categorySlug}`,
			providesTags: () => [{ type: 'CATEGORY' }],
		}),
		fetchCategoryToEdit: builder.query<CategoryProps, string>({
			query: catId => `${CATEGORY_URL}/edit/${catId}`,
			providesTags: () => [{ type: 'CATEGORY' }],
		}),
		fetchAllCategories: builder.query<CategoryProps[], void>({
			query: () => `${CATEGORY_URL}`,
			providesTags: () => [{ type: 'CATEGORY' }],
		}),

		deleteCategory: builder.mutation<{ message: string }, string>({
			query: categoryId => ({
				url: `${CATEGORY_URL}/${categoryId}`,
				method: 'DELETE',
			}),
			invalidatesTags: () => [{ type: 'CATEGORY' }],
		}),
	}),
})

export const {
	useCreateCategoryMutation,
	useFetchAllCategoriesQuery,
	useDeleteCategoryMutation,
	useFetchSingleCategoryQuery,
	useFetchCategoryToEditQuery,
	useUpdateCategoryMutation,
} = categoryApi
