import styles from './index.module.less'
import { NEWS_MAP } from './interface.ts'

function NewsCenter() {
  return (
    <div className={styles.root}>
      <img className="h-[279px]" src="/news/banner.png" alt="banner" />
      <div className="dynamic-wrap">
        <div className="dynamic-title">新闻动态</div>
        <div className="dynamic-list">
          {NEWS_MAP.map((item, index) => (
            <div className="dynamic-item" key={index} onClick={() => (window.location.href = item.link)}>
              <img
                className="w-[678px] h-[288px] rounded-4 object-contain"
                src={`/news/wechat/${item.img}`}
                alt="主要图片"
              />
              <div className="dynamic-info">
                <div className="info-con">{item.title}</div>
                <div className="text-end text-[#999999]">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewsCenter
