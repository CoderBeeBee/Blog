import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_URL = import.meta.env.VITE_API_URL
const USERS_URL = import.meta.env.VITE_USERS_URL

export const userApi = createApi({
	reducerPath: 'login',
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}`, credentials: 'include' }),
	tagTypes: ['User'],
	endpoints: builder => ({
		login: builder.mutation({
			query: ({ email, password }) => ({
				url: `${USERS_URL}/login`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { email, password },
			}),
		}),
		adminLogin: builder.mutation({
			query: ({ email, password }) => ({
				url: `${USERS_URL}/admin/login`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { email, password },
			}),
		}),

		createAccount: builder.mutation({
			query: ({ name, email, password, consents }) => ({
				url: `${USERS_URL}/registration`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: { name, email, password, consents },
			}),
			invalidatesTags: () => [{ type: 'User' }],
		}),
		deleteAccount: builder.mutation({
			query: confirmPassword => ({
				url: `${USERS_URL}/delete-account`,
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
				body: { confirmPassword },
			}),
		}),
		verifyAccount: builder.query({
			query: token => `${USERS_URL}/verify?token=${token}`,
		}),
		resendVerification: builder.mutation({
			query: email => ({
				url: `${USERS_URL}/resend-verification?email=${email}`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
			}),
		}),
		changePassword: builder.mutation({
			query: ({ newPassword, currentPassword }) => ({
				url: `${USERS_URL}/change-password`,
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: { newPassword, currentPassword },
			}),
		}),
		changeEmailAddress: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/change-email`,
				method: 'POST',
			}),
		}),
		resetPassword: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/reset-password`,
				method: 'POST',
			}),
		}),
		confirmResetPassword: builder.mutation({
			query: ({ newPassword, token }) => ({
				url: `${USERS_URL}/confirm-reset-password?token=${token}`,
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: { newPassword },
			}),
		}),
		confirmNewEmail: builder.mutation({
			query: ({ newEmail, token }) => ({
				url: `${USERS_URL}/confirm-new-email?token=${token}`,
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: { newEmail },
			}),
		}),
		forgotPassword: builder.mutation({
			query: email => ({
				url: `${USERS_URL}/forgot-password`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: email,
			}),
		}),
		logOut: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/logout`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
			}),
		}),
		fetchUserProfile: builder.query({
			query: () => `${USERS_URL}/get-user-profile`,
			providesTags: () => [{ type: 'User' }],
			// providesTags: _result => (_result ? [{ type: 'UpdateProfile', id: _result.id }] : []),
		}),
		updateProfile: builder.mutation({
			query: ({ name, updatedAvatar }) => ({
				url: `${USERS_URL}/update-profile`,
				method: 'PUT',
				body: { name, updatedAvatar },
			}),
			invalidatesTags: () => [{ type: 'User' }],
			// invalidatesTags: _result => (_result ? [{ type: 'UpdateProfile', id: _result.id }] : []),
		}),
		fetchUserByLimit: builder.query({
			query: params => {
				const queryString = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				).toString()

				return `${USERS_URL}/get-users-by-limit/?${queryString}`
			},
			providesTags: () => [{ type: 'User' }],
		}),
		fetchAdminsAndModerators: builder.query({
			query: params => {
				const queryString = new URLSearchParams(
					Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
				)

				return `${USERS_URL}/get-admins-moderators/?${queryString}`
			},
			providesTags: () => [{ type: 'User' }],
		}),
		adminCreateUser: builder.mutation({
			query: data => ({
				url: `${USERS_URL}/admin-create-user`,
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: data,
			}),
			invalidatesTags: () => [{ type: 'User' }],
		}),
		adminDeleteUser: builder.mutation({
			query: usersId => ({
				url: `${USERS_URL}/admin-delete-user`,
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
				body:{usersId}
			}),
			invalidatesTags: () => [{ type: 'User' }],
		}),
	}),
})

export const {
	useLoginMutation,
	useCreateAccountMutation,
	useLogOutMutation,
	useVerifyAccountQuery,
	useResendVerificationMutation,
	useFetchUserByLimitQuery,
	useFetchAdminsAndModeratorsQuery,
	useAdminCreateUserMutation,
	useAdminDeleteUserMutation,
	useFetchUserProfileQuery,
	useChangePasswordMutation,
	useResetPasswordMutation,
	useForgotPasswordMutation,
	useConfirmResetPasswordMutation,
	useDeleteAccountMutation,
	useChangeEmailAddressMutation,
	useConfirmNewEmailMutation,
	useUpdateProfileMutation,
	useAdminLoginMutation,
} = userApi
