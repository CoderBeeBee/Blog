const useAdsense = (clientId: string) => {
	if (!clientId) return

	if (document.querySelector(`#adsense-script`)) return

	const script = document.createElement('script')
	script.id = 'adsense-script'
	script.async = true
	script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
	script.crossOrigin = 'anonymous'

	document.head.appendChild(script)
}

export default useAdsense
