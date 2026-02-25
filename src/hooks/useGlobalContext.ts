import { use } from 'react'
import { GlobalContext } from '../context/globalContext'

const useGlobalContext = () => {
	const context = use(GlobalContext)

	if (!context) {
		throw new Error('Must be use with a ExampleProvider')
	}

	return context
}

export default useGlobalContext
