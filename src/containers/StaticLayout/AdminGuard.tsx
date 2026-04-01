import { type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router'
import type { RootState } from '../../store'

interface AdminGuardProps {
	children: ReactNode
}

const AdminGuard = ({ children }: AdminGuardProps) => {
	const { isLogged, role } = useSelector((state: RootState) => state.auth)
	const location = useLocation()

	if (!isLogged) {
		return <Navigate to="/admin/login" replace state={{ from: location }} />
	}

	if (role === 'User' ) {
		return <Navigate to="/" replace />
	}

	return <>{children}</>
}

export default AdminGuard
