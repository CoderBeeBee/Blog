export interface MenuItem {
	name?: string 
	slug?: string
	title?: string 
	href?: string 
	parent?: string | null
	children?: MenuItem[] 
}
export interface MenuTypes {
	title: string
	href: string

	children?: MenuItem[]
}

const home: MenuTypes = {
	title: 'Home',
	href: '/',
}
export const defaultCategories: MenuTypes = {
	title: 'Categories',
	href: '',
	children: [
		{ name: 'LifeStyle', slug: '/categories/lifestyle' },
		{ name: 'Culture', slug: '/categories/culture' },
		{ name: 'Travel', slug: '/categories/travel' },
		{ name: 'Nature', slug: '/categories/nature' },
		{ name: 'Photography', slug: '/categories/photography' },
		{ name: 'Vacation', slug: '/categories/vacation' },
		{ name: 'Work', slug: '/categories/work' },
		{ name: 'Health', slug: '/categories/health' },
		{ name: 'Family', slug: '/categories/family' },
	],
}
export const defaultCategories2: MenuTypes = {
	title: 'Categories',
	href: '',
	children: [
		{ name: 'LifeStyle', slug: '/categories/lifestyle' },
		{ name: 'Culture', slug: '/categories/culture' },
		{ name: 'Travel', slug: '/categories/travel' },
		{ name: 'Nature', slug: '/categories/nature' },
		{ name: 'Photography', slug: '/categories/photography' },
		{ name: 'Vacation', slug: '/categories/vacation' },
		{ name: 'Work', slug: '/categories/work' },
		{ name: 'Health', slug: '/categories/health' },
		{ name: 'Family', slug: '/categories/family' },
	],
}

const about: MenuTypes = {
	title: 'About',
	href: '/about',
}
const contact: MenuTypes = {
	title: 'Contact',
	href: '/contact',
}

export const dataNavigation = [home, defaultCategories,defaultCategories2, about, contact]
