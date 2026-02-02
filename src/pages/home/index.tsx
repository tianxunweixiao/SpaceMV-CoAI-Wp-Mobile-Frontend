import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactUs from '@/components/contact-us'
import Carousel from '@/components/carousel'
import { useAppDispatch } from '@/store'
import { setMenuIdx } from '@/store/modules/menuReducer'
import { getCompanyInfoConfig, CompanyInfoConfig, getCompanyProfileByPublishStatus } from '@/api/company'
import { getMainPageContent, MainPageData, CarouselImage, MainProduct } from '@/api/mainPage'
import { isPreviewMode, buildPathWithParams } from '@/router'
import styles from './index.module.less'

function Home() {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoConfig | null>(null)
  const [carouselImages, setCarouselImages] = useState<{ src: string; alt: string }[]>([])
  const [mainProducts, setMainProducts] = useState<MainProduct[]>([])

  useEffect(() => {
    dispatch(setMenuIdx(0))
    
    getCompanyInfoConfig(isPreviewMode())
      .then((res) => {
        if (res.code === 200 && res.data) {
          setCompanyInfo(res.data)
        }
      })
      .catch((error) => {
        console.error('获取公司信息失败:', error)
      })

    getMainPageContent(isPreviewMode())
      .then((res) => {
        if (res.code === 200 && res.data) {
          const isPublish = res.data.isPublish || '0'
          // 根据发布状态选择数据源
          const carouselImageLists = isPublish === '1' ? res.data.carouselImageLists : res.data.carouselImageListsTemp;
          const mainProductsData = isPublish === '1' ? res.data.mainProducts : res.data.mainProductsTemp;
          
          // 只显示isShow为'1'的轮播图
          const visibleCarouselImages = carouselImageLists
            .filter(img => img.isShow === '1')
            .map(item => ({
              src: item.imageUrl,
              alt: '轮播图'
            }))
          
          setCarouselImages(visibleCarouselImages)
          setMainProducts(mainProductsData)
        }
      })
      .catch((error) => {
        console.error('获取首页内容失败:', error)
      })
  }, [])

  return (
    <div className={styles.root} id="top">
      {carouselImages.length > 0 && <Carousel items={carouselImages} />}
      {/* 公司简介 */}
      {(() => {
        const profileData = companyInfo ? getCompanyProfileByPublishStatus(companyInfo) : null
        const profileContent = profileData?.profileThree
        if (!profileContent) return null
        return (
          <div className="info-wrap">
            <div className="into-title">公司简介</div>
            <div 
              className="mt-53 info-content"
              dangerouslySetInnerHTML={{
                __html: profileContent
              }}
            />
            <div
              className="more-btn"
              onClick={() => {
                const targetPath = isPreviewMode() ? '/preview/about' : '/about'
                const fullPath = buildPathWithParams(targetPath)
                nav(fullPath)
                dispatch(setMenuIdx(4))
              }}
            >
              了解更多
            </div>
          </div>
        )
      })()}
      {/* 主要产品 */}
      {mainProducts.length > 0 && (
        <div className="product-wrap">
          <div className="pro-title">主要产品</div>
          <div className="pro-list">
            {mainProducts.map((item, index) => (
              <div key={index} className="pro-item">
                <div className="item-img" style={{ backgroundImage: `url(${item.imageUrl})` }}>
                  <div className="mt-[170px] text-36 text-center">{item.productName}</div>
                </div>
                <div
                  className="item-btn"
                  onClick={() => {
                    if (item.jumpUrl) {
                      let targetPath = item.jumpUrl
                      // 检查是否为相对路径
                      if (targetPath.startsWith('/') && !targetPath.startsWith('//')) {
                        targetPath = isPreviewMode() ? `/preview${targetPath === '/' ? '' : targetPath}` : targetPath
                        // 对于相对路径，使用buildPathWithParams保留查询参数
                        targetPath = buildPathWithParams(targetPath)
                      }
                      nav(targetPath)
                    }
                  }}
                >
                  了解更多
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ContactUs />
    </div>
  )
}

export default Home