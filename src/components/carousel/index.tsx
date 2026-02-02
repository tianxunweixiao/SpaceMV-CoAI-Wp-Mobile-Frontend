import { useState, useEffect, ReactNode } from 'react'
import IconFont from '@/components/iconfont'
import styles from './index.module.less'

interface CarouselItem {
  src: string
  alt: string
  [key: string]: any
}

interface CarouselProps {
  items: CarouselItem[]
  autoplay?: boolean
  interval?: number
}

const Carousel = ({ items, autoplay = true, interval = 3000 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goTo = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!autoplay || items.length <= 1) return

    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [autoplay, interval, items.length])

  if (items.length === 0) return null

  return (
    <div className={styles.carousel}>
      <div className={styles.slides} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item, index) => (
          <div key={index} className={styles.slide}>
            <img className="w-full h-[422px] object-contain" src={item.src} alt={item.alt} />
          </div>
        ))}
      </div>

      {/* 只有一张图片时不显示控制按钮 */}
      {items.length > 1 && (
        <>
          <button className={styles.controlBtn + ' ' + styles.prevBtn} onClick={prev}>
            <IconFont type="icon-shangyige" />
          </button>
          <button className={styles.controlBtn + ' ' + styles.nextBtn} onClick={next}>
            <IconFont type="icon-xiayige" />
          </button>

          <div className={styles.pagination}>
            {items.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Carousel