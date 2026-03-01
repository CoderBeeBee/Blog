const useDateTimeLocal = () => {
	const dateToDateTimeLocal = (date: Date | null | string) => {
		if (!date) return ''

		// jeśli string → zamień na Date
		const d = typeof date === 'string' ? new Date(date) : date

		const pad = (n: number) => String(n).padStart(2, '0')
		const yyyy = d.getFullYear()
		const mm = pad(d.getMonth() + 1)
		const dd = pad(d.getDate())
		const hh = pad(d.getHours())
		const min = pad(d.getMinutes())

		return `${yyyy}-${mm}-${dd}T${hh}:${min}`
	}

	return {
		dateToDateTimeLocal,
	}
}

export default useDateTimeLocal
