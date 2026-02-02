import { memo } from 'react'
import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: ['/icon.js']
})

export default memo(IconFont)
