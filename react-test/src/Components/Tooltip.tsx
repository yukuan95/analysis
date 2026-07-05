import { Tooltip as AntdTooltip, ConfigProvider, theme } from 'antd'
import React from 'react'

const Tooltip = ({ title, children, isDarkMode }: { title: React.ReactNode, children: React.ReactNode, isDarkMode: boolean }) => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const trigger = isTouchDevice ? 'click' : 'hover'
  return <ConfigProvider
    theme={{
      algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }}
  >
    <AntdTooltip
      mouseEnterDelay={0}
      trigger={trigger}
      title={title}
    >
      <span>{children}</span>
    </AntdTooltip>
  </ConfigProvider>
}

export { Tooltip }