import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, Fragment } from 'react'
import { toast } from '@/components/toast/ToastManager.tsx'
import { useAppDispatch, useAppSelector } from '@/store'
import { setMenuIdx, setMenuOpen } from '@/store/modules/menuReducer'
import { getTopButtons, ButtonType } from '@/api/topButton'

import { isPreviewMode, buildPathWithParams } from '@/router'
import styles from './index.module.less'

interface DropButtonItem {
  text: string
  link: string
}

interface LinkItem {
  name: string
  path: string
  type: 'menu' | 'link'
  status?: 'developing' | 'complete' | 'completeSelf' | 'completeNav'
  buttonType?: ButtonType
  dropButtonList?: DropButtonItem[]
  isDropListOpen?: boolean
}

const MENU_MAP: LinkItem[] = [
  {
    name: '首页',
    path: '/',
    type: 'menu'
  },
  {
    name: '产品一',
    path: '/model',
    type: 'menu'
  },
  {
    name: '产品二',
    path: '/device',
    type: 'menu'
  },
  {
    name: '新闻中心',
    path: '/news',
    type: 'menu'
  },
  {
    name: '关于我们',
    path: '/about',
    type: 'menu'
  },
  // {
  //   name: '资产管理',
  //   path: 'http://com-showplatform.txxw.com/',
  //   type: 'link',
  //   status: 'complete'
  // },
  // {
  //   name: '内部办公',
  //   path: 'http://officemanagement.txxw.com/',
  //   type: 'link',
  //   status: 'complete'
  // },
  // {
  //   name: '产品试用',
  //   path: '/about',
  //   type: 'link',
  //   status: 'developing'
  // }
]

function Header() {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const menuIdx = useAppSelector((state) => state.menu.selMenuIdx)
  const open = useAppSelector((state) => state.menu.open)
  const [menuMap, setMenuMap] = useState<LinkItem[]>(MENU_MAP)

  const getCurrentEnvironment = (): 'intranet' | 'extranet' => {
    if (import.meta.env.VITE_ENV === 'intranet') return 'intranet'
    if (import.meta.env.VITE_ENV === 'extranet') return 'extranet'
    
    return 'extranet'
  }

  const currentEnvironment = getCurrentEnvironment()

  useEffect(() => {
    getTopButtons(isPreviewMode())
      .then((res) => {
        if (res.code === 200) {
          const response = res.data || []
          if (response.length) {
            let menuList = response.filter((item) => currentEnvironment === 'extranet' ? item.isShow === '1' : true)
            const dynamicButtons = menuList.map((item) => {
              const obj: LinkItem = {
                name: item.buttonText || '',
                path: item.jumpUrl || '',
                type: 'link', 
                status: item.state === '1' ? 'complete' : item.state === '2' ? 'completeSelf' : item.state === '3' ? 'completeNav' : 'developing',
                buttonType: item.buttonType,
                dropButtonList: item.dropButtonList,
                isDropListOpen: false
              }
              return obj
            })
            setMenuMap([...MENU_MAP, ...dynamicButtons])
          }
        }
      })
      .catch((error) => {
        console.error('获取顶部按钮失败:', error)
      })
  }, [])

  function toggleDropList(index: number) {
    setMenuMap(prevMenuMap => {
      return prevMenuMap.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            isDropListOpen: !item.isDropListOpen
          }
        }
        return item
      })
    })
  }

  function handleMenuClick(item: LinkItem, index: number) {
    if (item.buttonType === ButtonType.dropList) {
      toggleDropList(index)
    } else if (item.type === 'menu') {
      const targetPath = isPreviewMode() ? `/preview${item.path === '/' ? '' : item.path}` : item.path
      const fullPath = buildPathWithParams(targetPath)
      nav(fullPath)
      dispatch(setMenuIdx(index))
    } else if (item.type === 'link') {
      if (item.status === 'complete') window.open(item.path)
      else if (item.status === 'developing') toast.info('正在开发中！')
    }

    dispatch(setMenuOpen(false))
  }

  function handleDropButtonClick(link: string) {
    window.open(link)
    dispatch(setMenuOpen(false))
  }

  return (
    <div className={styles.root}>
      <img
        className="logo"
        src="/header/logo.png"
        alt="logo"
        onClick={() => {
          const targetPath = isPreviewMode() ? '/preview' : '/'
          const fullPath = buildPathWithParams(targetPath)
          nav(fullPath)
          dispatch(setMenuIdx(0))
        }}
      />
      <div className="right-wrap">
        {/*<div className="product-btn">产品试用</div>*/}
        <div className="menu-wrap">
          <img className="menu-icon" src="/header/menu.png" alt="菜单" onClick={() => dispatch(setMenuOpen(!open))} />
          <div
            className={classNames('menu-dropdown', {
              active: open
            })}
          >
            <div className="menu-content">
              {menuMap.map((item, index) => (
                <Fragment key={index}>
                  {item.buttonType === ButtonType.image ? (
                    <div
                      className={classNames('menu-item', {
                        active: index === menuIdx
                      })}
                      onClick={() => handleMenuClick(item, index)}
                    >
                      <img src={item.path} alt={item.name} style={{ maxHeight: '20px' }} />
                    </div>
                  ) : (
                    <>
                      <div
                        className={classNames('menu-item', {
                          active: index === menuIdx,
                          'drop-list': item.buttonType === ButtonType.dropList
                        })}
                        onClick={() => handleMenuClick(item, index)}
                      >
                        {item.name}
                        {item.buttonType === ButtonType.dropList && (
                          <span className="drop-arrow">
                            {item.isDropListOpen ? '▼' : '▶'}
                          </span>
                        )}
                      </div>
                      {item.buttonType === ButtonType.dropList && item.isDropListOpen && item.dropButtonList && item.dropButtonList.length > 0 && (
                        <div className="drop-list-content">
                          {item.dropButtonList.map((dropItem, dropIndex) => (
                            <div
                              key={dropIndex}
                              className="drop-list-item"
                              onClick={() => handleDropButtonClick(dropItem.link)}
                            >
                              {dropItem.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {index === 4 && <div className="line" />}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
