import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router'

// Layouts

import StaticLayout from './containers/StaticLayout/StaticLayout'
const AdminPanelLayout = lazy(() => import('./containers/StaticLayout/AdminPanelLayout'))
const AccountLayout = lazy(() => import('./containers/StaticLayout/AccountLayout'))
// Route Guards
import AuthGuard from './containers/StaticLayout/AuthGuard'
import AdminGuard from './containers/StaticLayout/AdminGuard'
import UserRoute from './containers/StaticLayout/UserRoute'
import MaintenanceGuard from './containers/StaticLayout/MaintenanceGuard'
// Publis Sites
import HomePage from './components/pages/HomePage/HomePage'
const AboutPage = lazy(() => import('./components/pages/AboutPage/AboutPage'))
const ContactPage = lazy(() => import('./components/pages/ContactPage/ContactPage'))
const SinglePostPage = lazy(() => import('./components/pages/SinglePostPage/SinglePostPage'))
const SingleCategoryPage = lazy(() => import('./components/pages/CategoryPage/SingleCategoryPage'))

// User pages
const LoginPage = lazy(() => import('./components/pages/LoginPage/LoginPage'))
const RegistrationPage = lazy(() => import('./components/pages/RegistrationPage/RegistrationPage'))
const VerifyPage = lazy(() => import('./components/pages/VerifyPage/VerifyPage'))

// Admin pages
const DashboardPage = lazy(() => import('./components/pages/AdminPanel/Dashboard/DashboardPage'))
const AdminRoomPage = lazy(() => import('./components/pages/AdminPanel/AdminRoom/AdminRoomPage'))
const ListOfPostPage = lazy(() => import('./components/pages/AdminPanel/Posts/ListOfPostPage/ListOfPostPage'))
const AddPostPage = lazy(() => import('./components/pages/AdminPanel/Posts/AddPostPage/AddPostPage'))
const EditPostPage = lazy(() => import('./components/pages/AdminPanel/Posts/EditPostPage/EditPostPage'))
const PostCategoryPage = lazy(() => import('./components/pages/AdminPanel/Posts/PostCategoryPage/PostCategoryPage'))
const PostHistory = lazy(() => import('./components/pages/AdminPanel/Posts/PostHistory/PostHistory'))
const ListPage = lazy(() => import('./components/pages/AdminPanel/Users/ListPage/ListPage'))
const AddUserPage = lazy(() => import('./components/pages/AdminPanel/Users/AddUserPage/AddUserPage'))
const RoleAndPermissionsPage = lazy(
	() => import('./components/pages/AdminPanel/Users/RoleAndPermissionsPage/RoleAndPermissionsPage'),
)
const ListOfCommentsPage = lazy(
	() => import('./components/pages/AdminPanel/Comments/ListOfComments/ListOfCommentsPage'),
)

const CommentsHistory = lazy(() => import('./components/pages/AdminPanel/Comments/ChangeHistory/CommentsHistory'))

const LoginAttempts = lazy(() => import('./components/pages/AdminPanel/Security/LoginAttempts/LoginAttempts'))
const UnauthorizedAccess = lazy(
	() => import('./components/pages/AdminPanel/Security/UnauthorizedAccess/UnauthorizedAccess'),
)
const PasswordEvents = lazy(() => import('./components/pages/AdminPanel/Security/PasswordEvents/PasswordEvents'))

const GeneralSettingsPage = lazy(() => import('./components/pages/AdminPanel/Settings/General/GeneralSettingsPage'))
const EmailSettingsPage = lazy(() => import('./components/pages/AdminPanel/Settings/Email/EmailSettingsPage'))
const IntegrationsSettingsPage = lazy(
	() => import('./components/pages/AdminPanel/Settings/Integrations/IntegrationsSettingsPage'),
)
// Account pages
const ProfilePage = lazy(() => import('./components/pages/AccountPages/ProfilePage/ProfilePage'))
const ResetPasswordPage = lazy(() => import('./components/pages/AccountPages/ResetPasswordPage/ResetPasswordPage'))
const DeleteAccountPage = lazy(() => import('./components/pages/AccountPages/DeleteAccountPage/DeleteAccountPage'))
const ChangeEmailPage = lazy(() => import('./components/pages/AccountPages/ChangeEmailPage/ChangeEmailPage'))

const UsersHistory = lazy(() => import('./components/pages/AdminPanel/Users/UsersHistory/UsersHistory'))
const PrivacyPolicy = lazy(() => import('./components/pages/PrivacyPolicy/PrivacyPolicy'))
const TermsAndConditions = lazy(() => import('./components/pages/TermsAndConditions/TermsAndConditions'))

const AnalyticsSettingsPage = lazy(
	() => import('./components/pages/AdminPanel/Settings/Analytics/AnalyticsSettingsPage'),
)
const SecuritySettingsPage = lazy(() => import('./components/pages/AdminPanel/Settings/Security/SecuritySettingsPage'))
const PostSettingsPage = lazy(() => import('./components/pages/AdminPanel/Settings/Post/PostSettingsPage'))
const InteractionsSettingsPage = lazy(
	() => import('./components/pages/AdminPanel/Settings/Interactions/InteractionsSettingsPage'),
)
const LegalPrivacyPage = lazy(
	() => import('./components/pages/AdminPanel/LegalDocuments/LegalPrivacyPage/LegalPrivacyPage'),
)
const LegalTermsPage = lazy(() => import('./components/pages/AdminPanel/LegalDocuments/LegalTermsPage/LegalTermsPage'))
const LegalAcknowledgmentsPage = lazy(
	() => import('./components/pages/AdminPanel/LegalDocuments/LegalAcknowledgmentsPage/LegalAcknowledgmentsPage'),
)

import Loader from './components/atoms/loader/Loader'
import PageNotFound from './components/pages/PageNotFound/PageNotFound'

import SubscriptionPage from './components/pages/SubscriptionPage/SubscriptionPage'
import UnsubscriptionPage from './components/pages/UnsubscriptionPage/UnsubscriptionPage'


const App = () => {
	return (
		<Router basename="/">
			<Routes>
				{/* Public sites */}
				<Route element={<MaintenanceGuard />}>
					<Route
						element={
							<Suspense fallback={<Loader />}>
								<StaticLayout />
							</Suspense>
						}>
						<Route path="/" element={<HomePage />} />
						<Route path="categories/:categorySlug" element={<SingleCategoryPage />} />

						<Route path="post/:category/:slug/*" element={<SinglePostPage />} />

						<Route path="about" element={<AboutPage />} />
						<Route path="contact" element={<ContactPage />} />
						<Route path="privacy-policy" element={<PrivacyPolicy />} />
						<Route path="terms-and-conditions" element={<TermsAndConditions />} />
					</Route>
						<Route path="/verify-subscription" element={<SubscriptionPage />} />
						<Route path="/unsubscribe" element={<UnsubscriptionPage />} />
						

					{/* User Routes */}
					<Route
						element={
							<Suspense fallback={<Loader />}>
								<UserRoute />
							</Suspense>
						}>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/registration" element={<RegistrationPage />} />
						<Route path="/verify" element={<VerifyPage />} />
					</Route>
				</Route>

				{/* Admin Panel */}
				<Route
					path="/admin"
					element={
						<AdminGuard>
							<Suspense fallback={<Loader />}>
								<AdminPanelLayout />
							</Suspense>
						</AdminGuard>
					}>
					<Route index element={<DashboardPage />} />

					<Route path="room" element={<AdminRoomPage />} />

					<Route path="posts/">
						<Route path="listofposts" element={<ListOfPostPage />} />
						<Route path="addpost" element={<AddPostPage />} />
						<Route path="editpost" element={<EditPostPage />} />
						<Route path="categories" element={<PostCategoryPage />} />
						<Route path="posts-history" element={<PostHistory />} />
					</Route>
					<Route path="users/">
						<Route path="list" element={<ListPage />} />
						<Route path="adduser" element={<AddUserPage />} />
						<Route path="permissions" element={<RoleAndPermissionsPage />} />
						<Route path="users-history" element={<UsersHistory />} />
					</Route>
					<Route path="comments/">
						<Route path="list" element={<ListOfCommentsPage />} />

						<Route path="comments-history" element={<CommentsHistory />} />
					</Route>
					<Route path="security">
						<Route path="login" element={<LoginAttempts />} />
						<Route path="access" element={<UnauthorizedAccess />} />
						<Route path="passwords" element={<PasswordEvents />} />
					</Route>
					<Route path="settings">
						<Route path="general" element={<GeneralSettingsPage />} />
						<Route path="security" element={<SecuritySettingsPage />} />
						<Route path="posts" element={<PostSettingsPage />} />
						<Route path="interactions" element={<InteractionsSettingsPage />} />
						<Route path="analytics" element={<AnalyticsSettingsPage />} />
						<Route path="email" element={<EmailSettingsPage />} />
						<Route path="integrations" element={<IntegrationsSettingsPage />} />
					</Route>
					<Route path="legal-documents">
						<Route path="privacy-policy" element={<LegalPrivacyPage />} />
						<Route path="terms-and-conditions" element={<LegalTermsPage />} />
						<Route path="acknowledgments" element={<LegalAcknowledgmentsPage />} />
					</Route>
				</Route>

				{/* Settings */}
				<Route
					path="/account"
					element={
						<AuthGuard>
							<Suspense fallback={<Loader />}>
								<AccountLayout />
							</Suspense>
						</AuthGuard>
					}>
					<Route index element={<ProfilePage />} />
					<Route path="reset-password" element={<ResetPasswordPage />} />
					<Route path="delete" element={<DeleteAccountPage />} />
					<Route path="change-email" element={<ChangeEmailPage />} />
				</Route>
				{/* 404 */}
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</Router>
	)
}

export default App
