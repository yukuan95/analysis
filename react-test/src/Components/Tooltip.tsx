import { Tooltip as AntdTooltip, } from 'antd'
import { css } from '@emotion/css'
import React from 'react'
import { useProxy } from 'valtio/utils'
import { state as _state } from '../Store'

const Tooltip = ({ title, children }: { title: React.ReactNode, children: React.ReactNode }) => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const trigger = isTouchDevice ? 'click' : 'hover'
  const state = useProxy(_state)
  return <>
    <AntdTooltip
      mouseEnterDelay={0}
      trigger={trigger}
      title={<span className={css`font-family: 'TAHOMA';`}>{title}</span>}
    >
      <span className={css`color:${state.isDarkMode ? '#FFFFFF' : '#000000'}; font-family: 'TAHOMA';`}>{children}</span>
    </AntdTooltip>
  </>
}

export { Tooltip }