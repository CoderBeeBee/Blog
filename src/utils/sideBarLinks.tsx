import {
	AdminSVG,
	CommentsSVG,
	DashboardSVG,
	LawSVG,
	NewsletterSVG,
	PostsSVG,
	ProfileSVG,
	SecuritySVG,
	SettingsSVG,
	UsersSVG,
} from '../assets/icons/adminPanelIcons/AdminPanelIcons'
import type { sideBarLinksProps } from '../types/types'

const adminLinks: sideBarLinksProps[] = [
	{
		title: 'Dashboard',
		href: '/admin',
		icon: <DashboardSVG />,
	},
	{
		title: 'Admin',
		href: '',
		icon: <AdminSVG />,
		children: [{ title: 'Admins&Moderators', href: '/admin/room' }],
	},
	{
		title: 'Posts',
		href: '',
		icon: <PostsSVG />,
		children: [
			{ title: 'List of Posts', href: '/admin/posts/listofposts' },
			{ title: 'Add Posts', href: '/admin/posts/addpost' },
			{ title: 'Categories', href: '/admin/posts/categories' },
			{ title: 'Change History', href: '/admin/posts/posts-history' },
		],
	},
	{
		title: 'Users',
		href: '',
		icon: <UsersSVG />,
		children: [
			{ title: 'List', href: '/admin/users/list' },
			{ title: 'Add User', href: '/admin/users/adduser' },
			{ title: 'Roles & Permissions', href: '/admin/users/permissions' },
			{ title: 'Change History', href: '/admin/users/users-history' },
		],
	},
	{
		title: 'Comments',
		href: '',
		icon: <CommentsSVG />,
		children: [
			{ title: 'List', href: '/admin/comments/list' },

			{ title: 'Change History', href: '/admin/comments/comments-history' },
		],
	},

	{
		title: 'Legal Documents',
		href: '',
		icon: <LawSVG />,
		children: [
			{ title: 'Privacy Policy ', href: '/admin/legal-documents/privacy-policy' },
			{ title: 'Terms and Conditions ', href: '/admin/legal-documents/terms-and-conditions' },
			{ title: 'Acknowledgments ', href: '/admin/legal-documents/acknowledgments' },
		],
	},
	{
		title: 'Newsletter',
		href: '/admin/newsletter',
		icon: <NewsletterSVG />,
	},
	{
		title: 'Security',
		href: '',
		icon: <SecuritySVG />,
		children: [
			{ title: 'Login Attempts', href: '/admin/security/login' },
			{ title: 'Unauthorized Access', href: '/admin/security/access' },
			{ title: 'Password Events', href: '/admin/security/passwords' },
		],
	},
	{
		title: 'Settings',
		href: '',
		icon: <SettingsSVG />,
		children: [
			{ title: 'General ', href: '/admin/settings/general' },
			{ title: 'Security ', href: '/admin/settings/security' },
			{ title: 'Posts ', href: '/admin/settings/posts' },
			{ title: 'Interactions ', href: '/admin/settings/interactions' },
			{ title: 'Analytics ', href: '/admin/settings/analytics' },
			{ title: 'Email ', href: '/admin/settings/email' },
			{ title: 'Integrations', href: '/admin/settings/integrations' },
		],
	},
]
const accountLinks: sideBarLinksProps[] = [
	{
		title: 'Account',
		href: '',
		icon: <ProfileSVG />,
		children: [
			{ title: 'Profile Info', href: '/account' },
			// { title: 'Security', href: '/account/profile/security' },
		],
	},
]

export { adminLinks, accountLinks }
