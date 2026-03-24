import { useState } from 'react'

const useOpenClosePopup = () => {
	const [openPopup, setOpenPopup] = useState<boolean>(false)
	const [popUpMessage, setPopUpMessage] = useState<string>('')

	const handleOpenPopup = () => {
		setOpenPopup(true)
	}

	const handleClosePopup = () => {
		setPopUpMessage('')
		setOpenPopup(false)
	}

	return {
		handleClosePopup,
		handleOpenPopup,
        setPopUpMessage,
		openPopup,
		popUpMessage,
	}
}

export default useOpenClosePopup
