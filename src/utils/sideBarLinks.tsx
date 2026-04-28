import {
	AdminSVG,
	AdsSVG,
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
		title: 'Administration',
		href: '',
		icon: <AdminSVG />,
		children: [{ title: 'Administration', href: '/admin/administration' }],
	},
	{
		title: 'Blog',
		href: '',
		icon: <PostsSVG />,
		children: [
			{ title: 'Posts', href: '/admin/blog/posts' },
			{ title: 'Categories', href: '/admin/blog/categories' },
			{ title: 'Tags', href: '/admin/blog/tags' },
			{ title: 'Change History', href: '/admin/blog/change-history' },
		],
	},
	{
		title: 'Users',
		href: '',
		icon: <UsersSVG />,
		children: [
			{ title: 'List', href: '/admin/users/list' },
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
		href: '',
		icon: <NewsletterSVG />,
		children: [
			{ title: 'Campaign', href: '/admin/newsletter/campaign' },
			{ title: 'Subscribers ', href: '/admin/newsletter/subscribers' },
		],
	},
	{
		title: 'Ads',
		href: '',
		icon: <AdsSVG />,
		children: [{ title: 'Ads', href: '/admin/ads' }],
	},
	{
		title: 'Access Security',
		href: '',
		icon: <SecuritySVG />,
		children: [
			{ title: 'User Attempts', href: '/admin/access-security/user-attempts' },
			{ title: 'Admin Attempts', href: '/admin/access-security/admin-attempts' },
		],
	},
	{
		title: 'Settings',
		href: '',
		icon: <SettingsSVG />,
		children: [
			{ title: 'Basic', href: '/admin/settings/basic' },
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
		children: [{ title: 'Profile Info', href: '/account' }],
	},
]

export { adminLinks, accountLinks }
