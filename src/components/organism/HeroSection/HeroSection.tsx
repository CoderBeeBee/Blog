import { useState, type MouseEvent, type TouchEvent } from 'react'

import type { ArticleContentProps, SocialProps } from '../../../types/types'

import SliderList from '../../atoms/SliderList/SliderList'
import SocialIcon from '../../atoms/SocialIcon/SocialIcon'
import styles from './HeroSection.module.scss'
import SliderDots from '../../atoms/SliderDots/SliderDots'

import Loader from '../../atoms/loader/Loader'

import useSocialLinks from '../../../hooks/useSocialLinks'
import { useFetchHeroPostLimitQuery } from '../../../slices/api/postApi'
import useGlobalContext from '../../../hooks/useGlobalContext'
import { ArrowNext, ArrowPrev } from '../../../assets/icons/Icons'

const HeroSection = () => {
	const [number, setNumber] = useState<number>(0)
	const [swipeStartX, setSwipeStartX] = useState<number>(0)
	const { data, isFetching } = useFetchHeroPostLimitQuery({})
	const { posts } = useGlobalContext()
	const limit = posts.heroPostLimit || 3
	const { socialLinks } = useSocialLinks()

	const handleSliderNext = () => {
		setNumber(prev => (prev >= limit - 1 ? 0 : prev + 1))
	}
	const handleSliderPrev = () => {
		setNumber(prev => (prev <= 0 ? limit - 1 : prev - 1))
	}
	const getClientX = (e: MouseEvent | TouchEvent): number => {
		if ('touches' in e && e.touches.length > 0) {
			return e.touches[0].clientX
		}
		if ('changedTouches' in e && e.changedTouches.length > 0) {
			return e.changedTouches[0].clientX
		}
		if ('clientX' in e) {
			return e.clientX
		}
		return 0
	}

	const handleSwipeStart = (e: MouseEvent | TouchEvent) => {
		setSwipeStartX(getClientX(e))
	}

	const handleSwipeEnd = (e: MouseEvent | TouchEvent) => {
		const swipeEndX = getClientX(e)

		const diff = +swipeEndX.toFixed(0) - +swipeStartX.toFixed(0)

		if (diff > 100) {
			handleSliderPrev()
		} else if (diff < -100) {
			handleSliderNext()
		}

		setSwipeStartX(0)
	}
	const handleSwipeOnClickDots = (e: MouseEvent<HTMLLIElement>, index: number) => {
		const target = e.currentTarget
		const el = Number(target.dataset.element)

		if (el === index) {
			setNumber(el)
		}
	}

	if (isFetching) return <Loader />

	return (
		<section id="hero" className={styles.homeContainer}>
			<div className={styles.heroWrapper}>
				<div
					className={styles.heroSlider}
					onMouseDown={e => handleSwipeStart(e)}
					onMouseUp={e => handleSwipeEnd(e)}
					onTouchStart={e => handleSwipeStart(e)}
					onTouchEnd={e => handleSwipeEnd(e)}>
					{data.heroPosts.map((data: ArticleContentProps, index: number) => (
						<SliderList key={index} styles={styles} data={data} index={index} number={number} />
					))}
				</div>

				<ul className={styles.dots}>
					{Array.from({ length: limit }, (_, index) => {
						return (
							<SliderDots
								handleSwipeOnClickDots={handleSwipeOnClickDots}
								key={index}
								styles={styles}
								index={index}
								number={number}
							/>
						)
					})}
				</ul>
			</div>
			<div className={styles.socialWrapper}>
				<p className={styles.socialText}>Follow</p>
				<span className={styles.lineThrough}></span>
				<ul className={styles.socialLinks}>
					{socialLinks.map((social: SocialProps) => {
						return (
							<SocialIcon key={social.name} social={social} styles={styles}>
								{social.icon}
							</SocialIcon>
						)
					})}
				</ul>
			</div>
			<div className={styles.arrowsWrapper}>
				<button
					type="button"
					aria-label="Previous slide"
					className={styles.arrowBtn}
					onClick={() => handleSliderPrev()}>
					<ArrowPrev />
				</button>
				<button type="button" aria-label="Next slide" className={styles.arrowBtn} onClick={() => handleSliderNext()}>
					<ArrowNext />
				</button>
			</div>
		</section>
	)
}

export default HeroSection
