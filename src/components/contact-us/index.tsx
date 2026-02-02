import { useEffect, useState } from 'react'
import { getCompanyInfoConfig, CompanyInfoConfig, getCompanyInfoByPublishStatus, getFocusItemsByPublishStatus } from '@/api/company'
import { isPreviewMode } from '@/router'

function ContactUs() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoConfig | null>(null)

  useEffect(() => {
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

  const info = companyInfo && getCompanyInfoByPublishStatus(companyInfo)
  const wechatList = companyInfo && getFocusItemsByPublishStatus(companyInfo)

  return (
    <div className="pt-59 pb-60 px-36">
      <div className="text-36 font-bold text-[#13146c] text-center">联系我们</div>
      {info?.addrUrl && (
        <img className="w-full mt-33 object-contain" src={info.addrUrl} alt="地址" />
      )}
      <div className="flex flex-col gap-6 mt-27 text-24">
        {info?.companyAddress && (
          <div className="flex items-start">
            <span className="font-bold flex-shrink-0">地址：</span>
            <div className="flex-1 break-words">
              <span>{info.companyAddress}</span>
            </div>
          </div>
        )}
        {info?.businessCooperation && (
          <div className="flex items-start">
            <span className="font-bold flex-shrink-0">商务合作：</span>
            <div className="flex-1 break-words">
              <span>{info.businessCooperation}</span>
            </div>
          </div>
        )}
        {info?.resumeDelivery && (
          <div className="flex items-start">
            <span className="font-bold flex-shrink-0">简历投递：</span>
            <div className="flex-1 break-words">
              <span>{info.resumeDelivery}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-around">
        {wechatList && wechatList.length > 0 && wechatList.map((item, index) => (
          <div className="flex flex-col gap-21 items-center mt-48" key={index}>
            <img className="w-[267px] h-[267px]" src={item.imageUrl} alt="公众号" />
            <div className="text-26 font-bold text-[#3D3D3D]">{item.focusName}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactUs
