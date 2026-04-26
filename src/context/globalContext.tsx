import {
	createContext,
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type KeyboardEvent,
	type ReactNode,
	type RefObject,
	type SetStateAction,
} from 'react'

import { useLocation, useNavigate } from 'react-router'
import { useLogOutMutation, userApi } from '../slices/api/userApi'
import { setLogout } from '../slices/authSlice'
import { postApi } from '../slices/api/postApi'
import { commentsApi } from '../slices/api/commentsApi'
import { statisticApi } from '../slices/api/statisticsApi'
import { postLikeApi } from '../slices/api/postLikeApi'
import { categoryApi } from '../slices/api/categoriesApi'
import { useMobileMenu } from '../hooks/useMobileMenu'
import { useMobileSideBarMenu } from '../hooks/useMobileSideBarMenu'
import { useFetchSettingsQuery } from '../slices/api/settingsApi'
import type {
	analyticsTypes,
	postsTypes,
	interactionTypes,
	differentTypes,
	basicTypes,
	securityTypes,
} from '../types/settingsSchema'
import type { socialTypes } from '../types/integrationsSchema'
import { useFetchAdsQuery } from '../slices/api/adApi'
import type { AdsTypes } from '../types/adsSchema'
import { useCategory } from '../hooks/useCategory'
import { useDispatch } from 'react-redux'

interface MenuContextProps {
	children: ReactNode
}

interface GlobalContextProps {
	openCloseUserMenu: () => void
	signOut: () => void
	navRef: RefObject<HTMLDivElement | null>
	userRef: RefObject<HTMLDivElement | null>
	sideBarRef: RefObject<HTMLDivElement | null>
	scrollMenu: boolean
	mobileMenu: ReturnType<typeof useMobileMenu>
	editContext: ReturnType<typeof useCategory>
	activeIndex: number | null
	activeSubIndex: number | null
	toggleMenu: boolean
	sideBarMenu: ReturnType<typeof useMobileSideBarMenu>
	basic: basicTypes
	security: securityTypes
	posts: postsTypes
	interactions: interactionTypes
	analytics: analyticsTypes
	different: differentTypes
	integrations: socialTypes
	ads: AdsTypes

	// Dropdown
	expandCollapseDropdown: (index: number) => void

	setActiveIndex: Dispatch<SetStateAction<number | null>>
	setActiveSubIndex: Dispatch<SetStateAction<number | null>>
	onKeyDown: (e: KeyboardEvent, index: number) => void
	onKeyDownSub: (e: KeyboardEvent, index: number) => void
	expandMenu: (index: number) => void
	collapseMenu: () => void
	hoverOverDropdown: () => void
	expandCollapseSubDropdown: (index: number) => void
	hoverOverSubdropdown: () => void
	hoverOverCollapseSubdropdown: () => void
	expandSubDropdown: (index: number) => void
	collapseSubDropdown: () => void
	onClickCollapseDropdown: () => void
	onKeyDownAdminSystemMenu: (e: KeyboardEvent) => void
	// Tooltip
	toolTipId: string
	expandToolTip: (id: string) => void
	collapseToolTip: () => void
}

const GlobalContext = createContext<GlobalContextProps | null>(null)

const GlobalProvider = ({ children }: MenuContextProps) => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [logOut] = useLogOutMutation()
	const sideBarMenu = useMobileSideBarMenu()
	const { close } = sideBarMenu
	const dispatch = useDispatch()
	const mobileMenu = useMobileMenu()
	const editContext = useCategory()
	const navRef = useRef<HTMLDivElement>(null)
	const sideBarRef = useRef<HTMLDivElement>(null)
	// Mobile menu
	const [toggleMenu, setToggleMenu] = useState<boolean>(false)
	const userRef = useRef<HTMLDivElement>(null)
	// Dropdown state
	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null)
	const [scrollMenu, setScrollMenu] = useState<boolean>(false)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const timeoutSubRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [openedSub, setOpenedSub] = useState<boolean>(false)

	// Settings data
	const { data: settings, isLoading } = useFetchSettingsQuery({})
	const { basic, security, posts, interactions, analytics, different, integrations } = settings ?? {}

	const { data: ads } = useFetchAdsQuery({})

	// Open close sign in menu
	const openCloseUserMenu = () => {
		setToggleMenu(prev => !prev)

		if (activeIndex !== null) setActiveIndex(null)
	}

	// Open close navigation mobile dropdown
	const expandCollapseDropdown = (index: number) => {
		if (Number.isNaN(index)) return

		if (activeIndex === index) {
			setTimeout(() => {
				setActiveIndex(null)
			}, 100)

			if (activeSubIndex !== null) setActiveSubIndex(null)
			setScrollMenu(false)
		} else {
			setActiveIndex(index)
			setActiveSubIndex(null)
			setScrollMenu(true)
		}
	}

	const onKeyDownAdminSystemMenu = (e: KeyboardEvent) => {
		if ('key' in e && e.key !== 'Enter') return
		setToggleMenu(prev => !prev)
	}

	const onKeyDown = (e: KeyboardEvent, index: number) => {
		if ('key' in e && e.key !== 'Enter') return
		if (activeIndex === index) {
			setActiveIndex(null)
		} else {
			setActiveIndex(index)
		}
	}
	const onKeyDownSub = (e: KeyboardEvent, index: number) => {
		if ('key' in e && e.key !== 'Enter') return
		if (activeSubIndex === index) {
			setActiveSubIndex(null)
		} else {
			setActiveSubIndex(index)
		}
	}

	// Open Close Desktop DropDown
	const expandMenu = (index: number) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}

		setActiveIndex(index)
		if (activeSubIndex !== null) setActiveSubIndex(null)
		if (toggleMenu) setToggleMenu(prev => !prev)
	}
	const collapseMenu = () => {
		timeoutRef.current = setTimeout(() => {
			setActiveIndex(null)
		}, 1000)
	}
	const hoverOverDropdown = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
	}

	const onClickCollapseDropdown = () => {
		if (activeIndex === null) return
		setActiveIndex(null)
	}

	// Open Close Desktop SubDropdown

	const expandCollapseSubDropdown = (index: number) => {
		if (index === activeSubIndex) {
			setActiveSubIndex(null)
		} else {
			setActiveSubIndex(index)
		}
	}

	const expandSubDropdown = (index: number) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
		if (timeoutSubRef.current) {
			clearTimeout(timeoutSubRef.current)
			timeoutSubRef.current = null
		}

		setActiveSubIndex(index)
		if (openedSub) setOpenedSub(false)
		// if (toggleMenu) setToggleMenu(prev => !prev)
	}

	const collapseSubDropdown = () => {
		if (openedSub) return

		if (timeoutSubRef.current) {
			clearTimeout(timeoutSubRef.current)
			timeoutSubRef.current = null
		}

		timeoutSubRef.current = setTimeout(() => {
			setActiveSubIndex(null)
		}, 500)
	}

	const hoverOverSubdropdown = () => {
		if (!openedSub) setOpenedSub(true)

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
		if (timeoutSubRef.current) {
			clearTimeout(timeoutSubRef.current)
			timeoutSubRef.current = null
		}
	}

	const hoverOverCollapseSubdropdown = () => {
		if (openedSub) setOpenedSub(false)

		timeoutSubRef.current = setTimeout(() => {
			setActiveSubIndex(null)
		}, 500)
	}

	// ToolTip
	const [toolTipId, setDisplayToolTip] = useState<string>('')
	const timeoutToolTipRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const expandToolTip = (id: string) => {
		if (timeoutToolTipRef.current) {
			clearTimeout(timeoutToolTipRef.current)
			timeoutToolTipRef.current = null
		}
		if (toolTipId === id) return
		setDisplayToolTip(id)
	}
	const collapseToolTip = () => {
		timeoutToolTipRef.current = setTimeout(() => {
			setDisplayToolTip('')
		}, 1000)
	}

	useEffect(() => {
		const handleClickOutside = (e: globalThis.MouseEvent) => {
			const el = userRef.current
			const el2 = sideBarRef.current
			if (!el && !el2) return

			const target = e.target as Node

			if (!el?.contains(target)) {
				setToggleMenu(false)
			}

			if (!el2?.contains(target)) {
				close()
			}
		}

		window.addEventListener('mousedown', handleClickOutside)
		return () => window.removeEventListener('mousedown', handleClickOutside)
	}, [close, dispatch])

	const signOut = async () => {
		try {
			dispatch(setLogout())

			await logOut({})

			dispatch(postApi.util.resetApiState())
			dispatch(commentsApi.util.resetApiState())
			dispatch(userApi.util.resetApiState())
			dispatch(statisticApi.util.resetApiState())
			dispatch(postLikeApi.util.resetApiState())
			dispatch(categoryApi.util.resetApiState())
			if (pathname !== '/') {
				navigate('/')
			}
			window.scrollTo({ top: 0, behavior: 'instant' })
		} catch (error) {
			console.log('Error during logout:', error)
		}
	}

	const value: GlobalContextProps = {
		openCloseUserMenu,
		expandCollapseDropdown,
		signOut,
		navRef,
		userRef,
		scrollMenu,
		mobileMenu,
		activeIndex,
		activeSubIndex,
		toggleMenu,
		sideBarMenu,
		sideBarRef,
		basic,
		security,
		posts,
		interactions,
		analytics,
		different,
		integrations,
		ads,
		setActiveIndex,
		setActiveSubIndex,
		onKeyDown,
		onKeyDownSub,
		// Expand menu
		expandMenu,
		collapseMenu,
		hoverOverDropdown,

		// SubDropdown
		expandCollapseSubDropdown,
		expandSubDropdown,
		collapseSubDropdown,
		hoverOverSubdropdown,
		hoverOverCollapseSubdropdown,
		// AdminDropdown
		onKeyDownAdminSystemMenu,
		onClickCollapseDropdown,
		editContext,
		// Tooltip
		toolTipId,
		expandToolTip,
		collapseToolTip,
	}
	if (isLoading) {
		return null
	}
	return <GlobalContext value={value}>{children}</GlobalContext>
}

export { GlobalContext, GlobalProvider }
