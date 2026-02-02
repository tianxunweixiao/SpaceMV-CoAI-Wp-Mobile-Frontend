import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store'
import { setMenuIdx } from '@/store/modules/menuReducer'
import { getCompanyInfoConfig, CompanyInfoConfig, getCompanyInfoByPublishStatus } from '@/api/company'
import { isPreviewMode, buildPathWithParams } from '@/router'
import styles from './index.module.less'

const LINKS_MAP = [
  {
    name: '首页',
    path: '/'
  },
  {
    name: '产品一',
    path: '/model'
  },
  {
    name: '产品二',
    path: '/device'
  },
  {
    name: '新闻中心',
    path: '/news'
  },
  {
    name: '关于我们',
    path: '/about'
  }
]

function Footer() {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoConfig | null>(null)
  const param = new URLSearchParams(window.location.search).get('param')

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

  function handleClick(path: string, index: number) {
    const targetPath = isPreviewMode() ? `/preview${path === '/' ? '' : path}` : path
    const fullPath = buildPathWithParams(targetPath)
    nav(fullPath)
    dispatch(setMenuIdx(index))
  }

  return (
    <div className={styles.root}>
      <div className="links-wrap">
        {LINKS_MAP.map((item, index) => (
          <div
            key={index}
            className={classNames('link-item', {
              'link-ret': index === LINKS_MAP.length - 1
            })}
            onClick={() => handleClick(item.path, index)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="info-wrap">
        <div className="text-[#B4B4B4]">{info?.copyrightInfo}（{info?.versionNumber}）</div>
        <div className="flex gap-20">
          <span className="flex gap-2">
            <img className="w-22 h-22" src="/icon.png" />
            {info?.securityRecord}
          </span>
          <span>{info?.icpRecord}{param ? `-${param}` : ''}</span>
        </div>
        <div className="text-[#B4B4B4]">{info?.companyName}</div>
      </div>
    </div>
  )
}

export default Footer
