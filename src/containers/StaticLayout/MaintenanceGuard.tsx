import { Outlet} from 'react-router'
import MaintenancePage from '../../components/pages/MaintenancePage/MaintenancePage'
import Loader from '../../components/atoms/loader/Loader'
import { useFetchSettingsQuery } from '../../slices/api/settingsApi'
// import { useSelector } from 'react-redux'
// import type { RootState } from '../../store'

const MaintenanceGuard = () => {
	const { data, isLoading } = useFetchSettingsQuery({})
	const maintenance = data?.security.maintenanceMode.maintenance
	// const { role } = useSelector((state: RootState) => state.auth)

	

	if (data === null || isLoading) {
		return <Loader />
	}

	// const isAdmin = role === 'Admin' || role === 'Moderator'

	// // ADMIN ZAWSZE MA DOSTĘP
	// if (isAdmin) {
	// 	return <Outlet />
	// }

	// DOZWOLONE ŚCIEŻKI PODCZAS MAINTENANCE
	// const allowedPaths = ['/login']

	if (maintenance ) {
		return <MaintenancePage />
	}
	// if (maintenance && !allowedPaths.some(path => location.pathname.startsWith(path))) {
	// 	return <MaintenancePage />
	// }

	return <Outlet />
}

export default MaintenanceGuard
