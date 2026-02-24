import { FacebookSVG, InstagramSVG, TwitterSVG, YouTubeSVG } from '../assets/icons/social/SocialIcons'
import { useFetchSettingsQuery } from '../slices/api/settingsApi'
import type { SocialProps } from '../types/types'

const useSocialLinks = () => {
	const { data } = useFetchSettingsQuery({})

	const { facebook, instagram, twitter, youTube } = data.integrations
	const socialLinks: SocialProps[] = [
		{ name: 'YoutTube', url: youTube, icon: <YouTubeSVG />, ariaLabel: 'Youtube' },
		{ name: 'Instagram', url: instagram, icon: <InstagramSVG />, ariaLabel: 'Instagram' },
		{ name: 'X(Twitter)', url: twitter, icon: <TwitterSVG />, ariaLabel: 'X(Twitter)' },
		{ name: 'Facebook', url: facebook, icon: <FacebookSVG />, ariaLabel: 'Facebook' },
	]

	return { socialLinks }
}

export default useSocialLinks
