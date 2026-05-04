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
export const defaultTags = [{ name: 'life' }, { name: 'travel' }, { name: 'work' }, { name: 'home' }]

export const theadPost = [
	'checkmark',
	'ID',
	'image',
	'title',
	'categories',
	'author',
	'views',
	'comments',
	'created At',
	'scheduled At',
	'published At',
	'status',
	'operations',
]
export const theadUsers = [
	'checkmark',
	'ID',
	'image',
	'name',
	'email',
	'created At',
	'last Login',
	'is Verified',
	'status',
	'operations',
]

export const theadComments = ['checkmark', 'ID', 'comment', 'post Title', 'author', 'created At', 'operations']

export const adminsAndModerators = ['Admin', 'Moderator', 'Editor']
export const role = ['Admin', 'Moderator', 'Editor', 'User']
export const rowsNumbers = [10, 25, 50]

export const postStatus = [{ name: 'Draft' }, { name: 'Published' }, { name: 'Scheduled' }]

export const theadAttempts = [
	'action',
	'result',
	'user',
	'createdAt',
	'source',
	'ipAddress',
	'location',
	'device',
	'data',
]
export const theadHistory = ['ID', 'action', 'performed By', 'created At', 'source', 'details']

export const theadSubscribers = ['checkmark', 'ID','email', 'is Verified', 'created At', 'last Sent', 'next Sent']

export const noChevron = ['details', 'ID', 'operations', 'checkmark', 'image']

export const userAttempActions = [
	'LOGIN_ATTEMPT',
	'LOGOUT_ATTEMPT',
	'UNAUTHORIZED_ATTEMPT',
	'CHANGE_PASSWORD_ATTEMPT',
	'RESET_PASSWORD_ATTEMPT',
	'ACCESS_DENIED',
	'DELETE_ACCOUNT_ATTEMPT',
	'UPDATE_PROFILE_ATTEMPT',
	'VERIFY_REGISTRATION_ATTEMPT',
	'RESEND_VERIFICATION_ATTEMPT',
	'CONFIRM_RESET_PASSWORD_ATTEMPT',
	'FORGOT_PASSWORD_ATTEMPT',
	'CHANGE_EMAIL_ATTEMPT',
	'CONFIRM_NEW_EMAIL_ATTEMPT',
	'CREATE_USER_ATTEMPT',
	'RESTORE_USER_ATTEMPT',
]
export const adminAttempActions = [
	'ADMIN_CREATE_USER_ATTEMPT',
	'ADMIN_DELETE_USER_ATTEMPT',
	'ADMIN_CREATE_SMTP',
	'ADMIN_UPDATE_SMTP',
	'ERROR_SMTP',
]

export const resultAttempt = [
	'SUCCESS',
	'UNAUTHORIZED',
	'FORBIDDEN',
	'INVALID_PASSWORD',
	'USER_NOT_FOUND',
	'RATE_LIMITED',
	'MISSING_PASSWORD',
	'USERNAME_TAKEN',
	'TOKEN_MISSING',
	'ALREADY_VERIFIED',
	'TOKEN_EXPIRED',
	'INVALID_TOKEN',
	'SERVER_ERROR',
	'USER_ALREADY_EXISTS',
	'USER_NOT_VERIFIED',
	'USER_NOT_ACTIVE',
	'MISSING_EMAIL',
	'USER_IS_ACTIVE',
]
export const userAgentDevice = ['DESKTOP', 'MOBILE', 'TABLET']
