import { Tooltip as AntdTooltip, } from 'antd'
import { state as _state } from '../Store'
import { useProxy } from 'valtio/utils'
import { css } from '@emotion/css'
import React from 'react'

const Tooltip = ({ title, children }: { title: React.ReactNode, children: React.ReactNode }) => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const trigger = isTouchDevice ? 'click' : 'hover'
  const state = useProxy(_state)
  return <>
    <AntdTooltip
      mouseEnterDelay={0}
      trigger={trigger}
      title={title}
    >
      <span className={css`color: ${state.isDarkMode ? '#FFFFFF' : '#000000'};`}>{children}</span>
    </AntdTooltip>
  </>
}

export { Tooltip }