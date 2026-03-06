import {
	createContext,
	useEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type MouseEvent,
	type ReactNode,
	type RefObject,
} from 'react'

import { useDispatch } from 'react-redux'
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

interface MenuContextProps {
	children: ReactNode
}

interface GlobalContextProps {
	openCloseUserMenu: () => void
	handleOpenCloseDropdown: (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
	signOut: () => void
	navRef: RefObject<HTMLDivElement | null>
	userRef: RefObject<HTMLDivElement | null>
	sideBarRef: RefObject<HTMLDivElement | null>
	scrollMenu: boolean
	mobileMenu: ReturnType<typeof useMobileMenu>
	activeIndex: number | null
	toggleMenu: boolean
	sideBarMenu: ReturnType<typeof useMobileSideBarMenu>
	basic: basicTypes
	security: securityTypes
	posts: postsTypes
	interactions: interactionTypes
	analytics: analyticsTypes
	different: differentTypes
	integrations: socialTypes
	ads:AdsTypes
}

const GlobalContext = createContext<GlobalContextProps | null>(null)

const GlobalProvider = ({ children }: MenuContextProps) => {
	const navigate = useNavigate()
	const [logOut] = useLogOutMutation()
	const { pathname } = useLocation()
	const dispatch = useDispatch()
	const mobileMenu = useMobileMenu()
	const sideBarMenu = useMobileSideBarMenu()
	const navRef = useRef<HTMLDivElement>(null)
	const sideBarRef = useRef<HTMLDivElement>(null)
	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const userRef = useRef<HTMLDivElement>(null)
	const [scrollMenu, setScrollMenu] = useState<boolean>(false)
	const [toggleMenu, setToggleMenu] = useState<boolean>(false)
	const { close } = sideBarMenu
	const { data: settings, isLoading } = useFetchSettingsQuery({})
	const { basic, security, posts, interactions, analytics, different, integrations } = settings ?? {}

	const {data:ads} = useFetchAdsQuery({})
	

	// Open close mobile dropdown
	const handleOpenCloseDropdown = (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
		const target = e.currentTarget
		const element = Number(target.dataset.element)

		if (Number.isNaN(element)) return
		if (activeIndex === element) {
			setActiveIndex(null)
			setScrollMenu(false)
		} else {
			setActiveIndex(element)
			setScrollMenu(true)
		}
	}

	const openCloseUserMenu = () => {
		setToggleMenu(prev => !prev)
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
	}, [close])

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
		handleOpenCloseDropdown,
		signOut,
		navRef,
		userRef,
		scrollMenu,
		mobileMenu,
		activeIndex,
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
		ads
	}
	if (isLoading) {
		return null
	}
	return <GlobalContext value={value}>{children}</GlobalContext>
}

export { GlobalContext, GlobalProvider }
