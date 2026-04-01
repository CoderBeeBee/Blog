import React, { useEffect, useRef } from 'react'

interface GoogleAdProps {
	client: string | undefined
	slot: string | undefined
	style?: React.CSSProperties
	format?: string
	responsive?: boolean
	className: string
}

declare global {
	interface Window {
		adsbygoogle?: Array<Record<string, unknown>>
	}
}

const GoogleAds = ({
	client,
	slot,
	style = { display: 'block' },
	className,
	format = 'auto',
	responsive = true,
}: GoogleAdProps) => {
	const adRef = useRef<HTMLModElement | null>(null)

	useEffect(() => {
		if (!client || !slot) return
		if (!adRef.current) return

		if (adRef.current?.getAttribute('data-ads-loaded') === 'true') {
			return
		}

		try {
			;(window.adsbygoogle = window.adsbygoogle || []).push({})
			adRef.current?.setAttribute('data-ads-loaded', 'true')
		} catch (err) {
			console.error('AdSense error:', err)
		}
	}, [client, slot])
	if (!client) return null
	return (
		<ins
			data-aos="fade-up"
			ref={adRef}
			className={`adsbygoogle ${className}`}
			style={style}
			data-ad-client={client}
			data-ad-slot={slot}
			data-ad-format={format}
			data-full-width-responsive={responsive ? 'true' : 'false'}
		/>
	)
}

export default GoogleAds
