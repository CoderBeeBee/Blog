import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { Navigate, Outlet } from 'react-router'
import { GlobalProvider } from '../../context/globalContext'

const UserRoute = () => {
	const { isLogged } = useSelector((state: RootState) => state.auth)

	if (isLogged) return <Navigate to="/" replace />

	return (
		<>
			<GlobalProvider>
				<Outlet />
			</GlobalProvider>
		</>
	)
}

export default UserRoute
