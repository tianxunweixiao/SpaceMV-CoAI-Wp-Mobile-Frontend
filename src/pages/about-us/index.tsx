/*
 * @Author: wangxiaoming
 * @Date: 2025-11-12 17:29:53
 * @Description: 描述
 */
import { useState, useEffect } from 'react'
import ContactUs from '@/components/contact-us'
import IconFont from '@/components/iconfont'
import { useAppDispatch } from '@/store'
import { setMenuIdx } from '@/store/modules/menuReducer'
import { getCompanyInfoConfig, CompanyInfoConfig, getProductCertsByPublishStatus, getCompanyProfileByPublishStatus } from '@/api/company'
import { isPreviewMode } from '@/router'
import DOMPurify from 'dompurify'
import styles from './index.module.less'

function AboutUs() {
  const [preImgSrc, setPreImgSrc] = useState('')
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoConfig | null>(null)
  const dispatch = useAppDispatch()

  const productCerts = companyInfo && getProductCertsByPublishStatus(companyInfo)
  const companyProfile = companyInfo && getCompanyProfileByPublishStatus(companyInfo)

  useEffect(() => {
    dispatch(setMenuIdx(4))
    
    getCompanyInfoConfig(isPreviewMode())
      .then((res) => {
        if (res.code === 200 && res.data) {
          setCompanyInfo(res.data)
        }
      })
      .catch((error) => {
        console.error('获取公司信息失败:', error)
      })
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return
    
    const touchEnd = e.changedTouches[0].clientX
    const minSwipeDistance = 50 // 最小滑动距离，防止误触

    if (touchStart - touchEnd > minSwipeDistance) {
      handleImageClick('next')
    } else if (touchEnd - touchStart > minSwipeDistance) {
      handleImageClick('pre')
    }
  }

  const handleImageClick = (type: 'pre' | 'next') => {
    if (!productCerts || productCerts.length === 0) return
    
    const totalImages = productCerts.length
    let newIndex
    if (type === 'pre') {
      newIndex = (currentIndex - 1 + totalImages) % totalImages
    } else {
      newIndex = (currentIndex + 1) % totalImages
    }
    setCurrentIndex(newIndex)
    setPreImgSrc(productCerts[newIndex].imageUrl)
  }

  return (
    <div className={styles.root}>
      <img className="h-[279px]" src="/about/banner.png" alt="banner" />
      <div className="company-wrap">
        <div className="company-title">公司简介</div>
        {companyProfile?.profileTwo && (
          <div className="company-con" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(companyProfile.profileTwo) }} />
        )}
      </div>
      <div className="product-wrap">
        <div className="product-title">产品认证</div>
        <div className="product-list">
          {productCerts && productCerts.map((item, index) => (
            <div
              className="product-item"
              key={index}
              onClick={() => {
                setPreImgSrc(item.imageUrl)
                setOpen(true)
                setCurrentIndex(index)
              }}
            >
              <img className="w-full h-full object-contain" src={item.imageUrl} alt="证书" />
            </div>
          ))}
        </div>
      </div>
      {open && (
        <div className="image-review" onClick={() => setOpen(false)}>
          <div
            className="preview-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="nav-btn prev-btn" onClick={() => handleImageClick('pre')}>
              <IconFont type="icon-shangyige" />
            </div>
            <img src={preImgSrc} alt="preview" />
            <div className="nav-btn next-btn" onClick={() => handleImageClick('next')}>
              <IconFont type="icon-xiayige" />
            </div>
            <div className="close-btn-wrap">
              <div className="close-btn" onClick={() => setOpen(false)}>
                <IconFont type="icon-guanbi" />
              </div>
            </div>
          </div>
        </div>
      )}
      <ContactUs />
    </div>
  )
}

export default AboutUs
