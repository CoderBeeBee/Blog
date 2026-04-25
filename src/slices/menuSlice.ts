import { createSlice } from '@reduxjs/toolkit'

interface InitialType {
	activeIndex: number | null
	activeSubIndex: number | null
	scrollMenu: boolean
	toggleMenu: boolean
	timeOutRef: number | null
	timeOutSubRef: number | null
	openedSub: boolean
}

const initialState: InitialType = {
	activeIndex: null,
	activeSubIndex: null,
	scrollMenu: false,
	toggleMenu: false,
	timeOutRef: null,
	timeOutSubRef: null,
	openedSub: false,
}

export const menuSlice = createSlice({
	name: 'menu',
	initialState,
	reducers: {
		setOpenCloseDropdown: (state, action) => {
			if (typeof action.payload !== 'number') return

			if (state.activeIndex === action.payload) {
				// setTimeout(() => {
				// }, 100)
				state.activeIndex = null

				if (state.activeSubIndex !== null) state.activeSubIndex = null
				state.scrollMenu = false
			} else {
				state.activeIndex = action.payload
				state.activeSubIndex = null
				state.scrollMenu = true
			}
		},
		setActiveIndex: (state, action) => {
			state.activeIndex = action.payload
		},
		setActiveSubIndex: (state, action) => {
			state.activeSubIndex = action.payload
		},

		setOpenCloseSubDropdown: (state, action) => {
			if (state.activeSubIndex === action.payload) {
				state.activeSubIndex = null
			} else {
				state.activeSubIndex = action.payload
			}
		},
		setToggleMenu: (state, action) => {
			state.toggleMenu = action.payload
		},

		setOpenDropdown: (state, action) => {
			state.activeIndex = action.payload

			if (state.toggleMenu) state.toggleMenu = false
		},
		setCloseDropdown: state => {
			state.activeIndex = null
		},
		setTimeOutRef: (state, action) => {
			state.timeOutRef = action.payload
		},
		setTimeOutSubRef: (state, action) => {
			state.timeOutSubRef = action.payload
		},
		setOpenSubDropdown: (state, action) => {
			state.activeSubIndex = action.payload

			if (state.openedSub) state.openedSub = false
		},
		setCloseSubDropdown: state => {
			if (state.openedSub) return
			state.activeSubIndex = null
		},
		setOpenedSub: (state, action) => {
			state.openedSub = action.payload
		},
	},
})

export const {
	setOpenCloseDropdown,
	setOpenCloseSubDropdown,
	setActiveIndex,
	setActiveSubIndex,
	setToggleMenu,
	setOpenDropdown,
	setCloseDropdown,
	// ------------
	// Subdropdown
	setOpenSubDropdown,
	setCloseSubDropdown,
	// ----------
	setTimeOutRef,
	setTimeOutSubRef,
	setOpenedSub,
} = menuSlice.actions
