import { Helmet } from 'react-helmet'

interface SeoProps {
	title?: string
	description?: string
	keywords?: string
	author?: string
	ogImage?: string
	canonicalUrl?: string
	type?: 'website' | 'article'
	publishedTime?: string
	modifiedTime?: string

	twitterSite?: string
	defaultLogo?: string
}

const defaultSeo = {
	title: 'Moja Strona Podróżnicza',
	description: 'Eksplorujemy świat, podróże i przygody.',
	keywords: 'Podróże, przygody, blog podróżniczy',
	author: 'Coding Bee',
	ogImage: 'https://twoja-strona.pl/default-og-image.jpg',
	defaultLogo: '',
	siteName: 'Moja Strona Podróżnicza',
	twitterCard: 'summary_large_image',
	canonicalUrl: `${import.meta.env.VITE_SITE_URL}`,
}

const Seo = ({
	title,
	description,
	keywords,
	author,
	ogImage,
	canonicalUrl,
	type = 'website',
	publishedTime,
	modifiedTime,
	twitterSite,
	defaultLogo,
}: SeoProps) => {
	const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : defaultSeo.canonicalUrl)

	const seoTitle = title || defaultSeo.title
	const seoDescription = description || defaultSeo.description
	const seoKeywords = keywords || defaultSeo.keywords
	const seoAuthor = author || defaultSeo.author
	const seoOgImage = ogImage || defaultSeo.ogImage
	const seoDefaultLogo = defaultLogo || defaultSeo.defaultLogo
	return (
		<Helmet>
			{/* Podstawowe meta */}
			<title>{seoTitle}</title>
			<meta name="description" content={seoDescription} />
			<meta name="keywords" content={seoKeywords} />
			<meta name="author" content={seoAuthor} />
			<link rel="canonical" href={currentUrl} />

			{/* Favicon */}
			<link rel="icon" href={seoDefaultLogo} type="image/png" />
			<link rel="shortcut icon" href={seoDefaultLogo} type="image/png" />
			<link rel="apple-touch-icon" href={seoDefaultLogo} />

			{/* Open Graph */}
			<meta property="og:title" content={seoTitle} />
			<meta property="og:description" content={seoDescription} />
			<meta property="og:image" content={seoOgImage} />
			<meta
				property="og:image:alt"
				content="Poradniki programowania w JavaScript dla początkujących i zaawansowanych"
			/>
			<meta property="og:type" content={type} />
			<meta property="og:url" content={currentUrl} />
			<meta property="og:site_name" content={defaultSeo.siteName} />
			{type === 'article' && publishedTime && (
				<meta property="article:published_time" content={new Date(publishedTime).toISOString()} />
			)}
			{type === 'article' && modifiedTime && (
				<meta property="article:modified_time" content={new Date(modifiedTime).toISOString()} />
			)}
			{type === 'article' && seoAuthor && <meta property="article:author" content={seoAuthor} />}

			{/* Twitter Cards */}
			<meta name="twitter:card" content={defaultSeo.twitterCard} />
			{twitterSite && <meta name="twitter:site" content={twitterSite} />}
			<meta name="twitter:title" content={seoTitle} />
			<meta name="twitter:description" content={seoDescription} />
			<meta name="twitter:image" content={seoOgImage} />

			{/* JSON-LD */}
			<script type="application/ld+json">
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': type === 'article' ? 'Article' : 'WebSite',
					name: seoTitle,
					description: seoDescription,
					url: currentUrl,
					author: seoAuthor ? { '@type': 'Person', name: seoAuthor } : undefined,
					datePublished: publishedTime ? new Date(publishedTime).toISOString() : undefined,
					dateModified: modifiedTime ? new Date(modifiedTime).toISOString() : undefined,
				})}
			</script>
		</Helmet>
	)
}

export default Seo
