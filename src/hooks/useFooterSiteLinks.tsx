

const useFooterSiteLinks = () => {
	const siteLinks = [
		{ name: 'About us', url: '/about' },
		{ name: 'FAQ', url: '/faq' },
		{ name: 'Terms and Conditions', url: '/terms-and-conditions' },
		{ name: 'Privacy Policy', url: '/privacy-policy' },
		
	]

    return {
        siteLinks
    }
}

export default useFooterSiteLinks
