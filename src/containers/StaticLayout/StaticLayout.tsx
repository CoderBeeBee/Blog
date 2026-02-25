import Aos from 'aos'
import 'aos/dist/aos.css'
import { lazy, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import useWindowSize from '../../hooks/useWindowSize'
import { SinglePostProvider } from '../../context/createPostContext'
import { GlobalProvider } from '../../context/globalContext'
import CookieBanner from '../CookieBanner/CookieBanner'
import { useIncrementPageViewsMutation } from '../../slices/api/statisticsApi'
import { useFetchSettingsQuery } from '../../slices/api/settingsApi'
import useIncrementViews from '../../hooks/useIncrementViews'
const Navigation = lazy(() => import('../Navigation/Navigation'))
import Footer from '../Footer/Footer'

const StaticLayout = () => {
	const { isLoading } = useSelector((state: RootState) => state.theme)
	const { width } = useWindowSize()
	const { pathname } = useLocation()
	const {
		data: { analytics },
	} = useFetchSettingsQuery({})
	const [incrementPageViews] = useIncrementPageViewsMutation()
	const { handleIncrementPageViews } = useIncrementViews()
	const { data } = useFetchSettingsQuery({})

	const path = encodeURIComponent(pathname)

	useEffect(() => {
		if (data && !data.analytics.analyticsEnabled) {
			incrementPageViews({})
		} else {
			handleIncrementPageViews({ path })
		}
	}, [data, handleIncrementPageViews, incrementPageViews, path])

	useEffect(() => {
		if (!isLoading) {
			Aos.init({
				duration: 800,
				easing: 'ease-in-out',
				delay: 400,
			})
		}
	}, [isLoading])

	useEffect(() => {
		if (!isLoading) {
			Aos.refresh()
		}
	}, [pathname, isLoading, width])

	return (
		<GlobalProvider>
			<SinglePostProvider>
				{analytics && analytics.analyticsEnabled && <CookieBanner />}
				<div data-aos="fade-zoom-in">
					<Navigation />

					<main style={{ minHeight: '100dvh' }}>
						<Outlet />
					</main>
					<Footer />
				</div>
			</SinglePostProvider>
		</GlobalProvider>
	)
}

export default StaticLayout
