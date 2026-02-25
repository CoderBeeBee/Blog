export const defaultCategories = [
	{ name: 'LifeStyle' },
	{ name: 'Culture' },
	{ name: 'Travel' },
	{ name: 'Nature' },
	{ name: 'Photography' },
	{ name: 'Vacation' },
	{ name: 'Work' },
	{ name: 'Health' },
	{ name: 'Family' },
]

export const thead = [
	'title',
	'author',
	'categories',
	'createdAt',
	'publishedAt',
	'comments',
	'views',
	'status',
	'actions',
]
export const theadUsers = ['name', 'email', 'createdAt', 'isVerified', 'comments', 'role','status','lastLogin' ,'actions']
export const theadAdminsAndModerators = [
	'name',
	'email',
	'createdAt',
	
	'comments',
	'posts',
	'role',
	'lastLogin',
	'actions',
]
export const theadComments = ['author', 'content', 'postTitle', 'createdAt', 'actions']
export const status = ['Draft', 'Published', 'Archived']
export const adminsAndModerators = ['Admin', 'Moderator']
export const role = ['Admin', 'Moderator', 'User']
export const rowsNumbers = [10, 25, 50]

export const statusOptions = ['draft', 'publish']


