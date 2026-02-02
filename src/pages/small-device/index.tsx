import { useEffect, useState } from 'react'
import { getProductInfoConfig, ProductData, getDeviceProductBasicInfoByPublishStatus, getDeviceApplicationScenariosByPublishStatus, getDeviceTypicalCaseProductsByPublishStatus } from '@/api/product'
import { isPreviewMode } from '@/router'
import styles from './index.module.less'

function SmallDevice() {
  const [productData, setProductData] = useState<ProductData | null>(null)

  useEffect(() => {
    getProductInfoConfig(isPreviewMode())
      .then((res) => {
        if (res.code === 200 && res.data) {
          setProductData(res.data)
        }
      })
      .catch((error) => {
        console.error('获取产品信息失败:', error)
      })
  }, [])

  const deviceProductInfo = productData && getDeviceProductBasicInfoByPublishStatus(productData)
  const deviceApplicationScenarios = productData && getDeviceApplicationScenariosByPublishStatus(productData)
  const deviceTypicalCaseProducts = productData && getDeviceTypicalCaseProductsByPublishStatus(productData)
  return (
    <div className={styles.root}>
      {deviceProductInfo && (
        <div className="product-wrap">
          <img className="product-image" src={deviceProductInfo.backgroundImageUrl} />
          <div className="product-info">
            <div className="product-name">{deviceProductInfo.productName}</div>
            {deviceProductInfo.productIntroduction && (
              <div className="product-introduction">{deviceProductInfo.productIntroduction}</div>
            )}
          </div>
        </div>
      )}
      {deviceProductInfo && deviceProductInfo.detailedIntroduction && (
        <div className="detailed-introduction">{deviceProductInfo.detailedIntroduction}</div>
      )}
      <div className="scene-wrap">
        <div className="scene-title">应用场景</div>
        <div className="scene-list">
          {deviceApplicationScenarios && deviceApplicationScenarios.map((item, index) => (
            <div className="scent-item" key={index}>
              <div className="item-label">{item.scenarioName }</div>
              <div className="item-con">{item.detailedIntroduction}</div>
              <img className="h-[390px] object-cover" src={item.backgroundImageUrl} alt="场景" />
            </div>
          ))}
        </div>
      </div>

      <div className="typical-case-wrap">
        <div className="typical-case-title">典型产品</div>
        <div className="typical-case-list">
          {deviceTypicalCaseProducts && deviceTypicalCaseProducts.map((item, index) => (
            <div className="typical-case-item" key={index}>
              <div className="flex items-center justify-center case-product-introduction">
                <div className="case-product-icon-left"></div>
                {item.productIntroduction}
                <div className="case-product-icon-right"></div>  
              </div>
              <div className="case-detailed-introduction">{item.detailedIntroduction}</div>
              {(item.standardFunctions && item.standardFunctions.length > 0) || (item.customServices && item.customServices.length > 0) ? (
                <div className="case-functions-wrap">
                  {item.standardFunctions && item.standardFunctions.length > 0 && (
                    <div className="case-standard-functions">
                      <div className="case-functions-title">标配功能</div>
                      <div> 
                        {item.standardFunctions.map((func, idx) => (
                          <div className="flex align-center case-function-item" key={idx}>
                            <span className="mr-16">●</span>
                            <div>{func}</div>
                          </div>
                        ))}
                      </div>
                     
                    </div>
                  )}
                  {item.customServices && item.customServices.length > 0 && (
                    <div className="case-custom-services">
                      <div className="case-functions-title">定制服务</div>
                      <div>
                        {item.customServices.map((service, idx) => (
                          <div className="flex align-center case-function-item" key={idx}> 
                            <span className="mr-16">●</span>
                            <div>{service}</div>
                          </div>
                        ))}
                      </div>
                      
                    </div>
                  )}
                </div>
              ) : null}
              <img className="case-image" src={item.imageUrl} alt="案例图片" />
              {index < deviceTypicalCaseProducts.length - 1 && <div className="case-divider" />}
            </div>
          ))}
        </div>
      </div>



       {/* <img className="h-[2556px] device-info-img" src="/device/info.png" /> */}
    </div>
  )
}

export default SmallDevice
