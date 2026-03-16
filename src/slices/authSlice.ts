import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

interface SetDataType {
	isLogged: boolean
	justLoggedOut: boolean
	name: string
	id: string
	avatar: string
	role: string
}

interface SetDataPayload {
	name: string
	id: string
	avatar: { src: string }
	role: string
}

let name = ''
let id = ''
let avatar = ''

let role = ''
const stored = localStorage.getItem('user')
if (stored) {
	try {
		const decoded = JSON.parse(stored)

		name = decoded.name || ''
		id = decoded.id || ''
		avatar = decoded.avatar?.src || ''

		role = decoded.role || ''
	} catch (error) {
		console.warn('Błąd podczas dekodowania usera z localStorage:', error)
	}
}

const initialState: SetDataType = {
	isLogged: Cookies.get('user') === 'ok',
	justLoggedOut: false,
	name,
	id,
	avatar,

	role,
}
const sameSiteValue: 'none' | 'strict' = import.meta.env.VITE_NODE_ENV === 'production' ? 'none' : 'strict'
export const USER_COOKIE_OPTIONS = {
	secure: import.meta.env.VITE_NODE_ENV === 'production' ? true : false,
	sameSite: sameSiteValue,
	path: '/',
	expires: 1, // 1 dzień
}
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setLogin: (state, action: PayloadAction<boolean>) => {
			Cookies.set('user', 'ok', USER_COOKIE_OPTIONS)

			state.isLogged = action.payload
			state.justLoggedOut = !action.payload
		},
		setData: (state, action: PayloadAction<SetDataPayload>) => {
			const { name, id, avatar, role } = action.payload
			state.name = name
			state.id = id
			state.avatar = avatar.src

			state.role = role

			try {
				const encoded = JSON.stringify({ name, id, avatar, role })

				localStorage.setItem('user', encoded)
			} catch (error) {
				console.log('Nie udało się zapisać w localStorage:', error)
			}
		},

		setLogout: state => {
			Cookies.remove('user', USER_COOKIE_OPTIONS)
			localStorage.removeItem('user')
			state.isLogged = false
			state.justLoggedOut = true
			state.name = ''
			state.id = ''
			state.avatar = ''

			state.role = ''
		},
	},
})

export const { setLogin, setData, setLogout } = authSlice.actions
