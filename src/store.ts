import { configureStore } from '@reduxjs/toolkit'
import { themeSlice } from './slices/themeSlice'
import { postApi } from './slices/api/postApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import { commentsApi } from './slices/api/commentsApi'
import { userApi } from './slices/api/userApi'
import { authSlice } from './slices/authSlice'
import { statisticApi } from './slices/api/statisticsApi'
import { postLikeApi } from './slices/api/postLikeApi'
import { categoryApi } from './slices/api/categoriesApi'
import { cloudinaryApi } from './slices/api/cloudinaryApi'
import { emailApi } from './slices/api/emailApi'
import { generalApi } from './slices/api/settingsApi'
import { legalApi } from './slices/api/legalDocumentsApi'
import { subscriptionApi } from './slices/api/subscriptionApi'
import { newsletterApi } from './slices/api/newsletterApi'
import { securityApi } from './slices/api/securityApi'
import { auditlogApi } from './slices/api/auditLogApi'
import { tagsApi } from './slices/api/tagsApi'

export const store = configureStore({
	reducer: {
		theme: themeSlice.reducer,
		auth: authSlice.reducer,
		[postApi.reducerPath]: postApi.reducer,
		[commentsApi.reducerPath]: commentsApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		[statisticApi.reducerPath]: statisticApi.reducer,
		[postLikeApi.reducerPath]: postLikeApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[cloudinaryApi.reducerPath]: cloudinaryApi.reducer,
		[emailApi.reducerPath]: emailApi.reducer,
		[generalApi.reducerPath]: generalApi.reducer,
		[legalApi.reducerPath]: legalApi.reducer,
		[subscriptionApi.reducerPath]: subscriptionApi.reducer,
		[newsletterApi.reducerPath]: newsletterApi.reducer,
		[securityApi.reducerPath]: securityApi.reducer,
		[auditlogApi.reducerPath]: auditlogApi.reducer,
		[tagsApi.reducerPath]: tagsApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(postApi.middleware)
			.concat(commentsApi.middleware)
			.concat(userApi.middleware)
			.concat(statisticApi.middleware)
			.concat(postLikeApi.middleware)
			.concat(categoryApi.middleware)
			.concat(cloudinaryApi.middleware)
			.concat(emailApi.middleware)
			.concat(generalApi.middleware)
			.concat(legalApi.middleware)
			.concat(subscriptionApi.middleware)
			.concat(newsletterApi.middleware)
			.concat(securityApi.middleware)
			.concat(auditlogApi.middleware)
			.concat(tagsApi.middleware),
})

setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
