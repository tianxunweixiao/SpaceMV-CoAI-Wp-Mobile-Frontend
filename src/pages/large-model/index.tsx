import { useEffect, useState } from 'react'
import { getProductInfoConfig, ProductData, getLLMProductBasicInfoByPublishStatus, getLLMApplicationScenariosByPublishStatus, getLLMTypicalCaseProductsByPublishStatus } from '@/api/product'
import { isPreviewMode } from '@/router'
import styles from './index.module.less'

function LargeModel() {
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

  const llmProductInfo = productData && getLLMProductBasicInfoByPublishStatus(productData)
  const llmApplicationScenarios = productData && getLLMApplicationScenariosByPublishStatus(productData)
  const llmTypicalCaseProducts = productData && getLLMTypicalCaseProductsByPublishStatus(productData)

  return (
    <div className={styles.root}>
      {llmProductInfo && (
        <div className="relative" style={{ width:'100%' }}>
          <img 
            src={llmProductInfo.backgroundImageUrl} 
            alt={llmProductInfo.productName}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <div className="absolute inset-0 flex flex-col items-center mt-[100px]">
            <div className="text-white font-bold text-[26px]">{llmProductInfo.productName}</div>
            {llmProductInfo.productIntroduction && (
              <div className="text-white font-bold text-[22px] mt-[30px]">{llmProductInfo.productIntroduction}</div>
            )}
          </div>
        </div>
      )}
      {llmApplicationScenarios && llmApplicationScenarios.map((scenario, index) => (
        <div key={index} className="relative" style={{ width:'100%' }}>
          <img 
            src={scenario.backgroundImageUrl} 
            alt={scenario.scenarioName}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <div className="absolute inset-0 flex flex-col items-center mt-[30px]">
            <div className="flex flex-col items-center justify-center min-h-[160px]">
              <div className="text-white font-bold text-[26px]">{scenario.scenarioName}</div>
              {scenario.scenarioIntroduction && (
                <div className="text-white font-bold text-[22px] mt-[26px]">{scenario.scenarioIntroduction}</div>
              )}
              {scenario.detailedIntroduction && (
                <div className="text-white font-bold text-[18px] mt-[20px]">{scenario.detailedIntroduction}</div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="case-wrap">
        <div className="case-title">典型案例</div>
        <div className="case-list">
          {llmTypicalCaseProducts && llmTypicalCaseProducts.map((c, index) => (
            <div className="case-item" key={index}>
              <img className="w-full h-[382px] object-cover" src={c.imageUrl} />
              <div className="item-info">
                <div className="info-title">{c.productName}</div>
                <div className="info-btns">
                  {c.standardFunctions && c.standardFunctions.map((i, idx) => (
                    <div className="btn" key={idx}>
                      {i}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LargeModel
