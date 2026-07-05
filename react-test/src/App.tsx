import { LeftArrowButton, RightArrowButton } from './Components/ArrowButton'
import { state as _state, onMount, onEffect } from './Store'
import { MonthPicker } from './Components/MonthPicker'
import { Dropdown } from './Components/Dropdown'
import { Tooltip } from './Components/Tooltip'
import { useMount } from "@reactuses/core"
import { useProxy } from 'valtio/utils'
import { Switch, Spin, ConfigProvider, theme } from 'antd'
import { css } from '@emotion/css'
import { useEffect } from 'react'
import * as lib from './Lib'

function _App() {
  const state = useProxy(_state)
  return <>
    <div className={css`margin-top: 20px;`}></div>
    <div className={css`display: flex; justify-content: end;`}>
      <Switch
        checked={state.isDarkMode}
        onChange={() => state.isDarkMode = !state.isDarkMode}
        checkedChildren="Dark" unCheckedChildren="Light" />
    </div>
    <div className={css`margin-top: 20px;`}></div>
    <div className={css`display: flex; justify-content: space-between; align-items: center;`}>
      <div>
        {state.data?.priceLog?.accountAddress ? <Tooltip title={state.data.priceLog.accountAddress}>
          <span className={css`user-select: none;`}>
            <span>{state.data.priceLog.accountAddress.slice(0, 6)}</span>
            <span>...</span>
            <span>{state.data.priceLog.accountAddress.slice(-4)}</span>
          </span>
        </Tooltip> : <></>}
      </div>
      <div>
        <Dropdown
          value={state.dropdownGraphValue} width={'150px'}
          array={state.dropdownGraphArray}
          onChange={(val) => state.dropdownGraphValue = val}
        ></Dropdown>
      </div>
    </div>
    <div className={css`margin-top: 20px;`}></div>
    <div className={css`display: flex; justify-content: space-between;`}>
      <div>
        <MonthPicker
          value={state.yearMonth} width={'110px'} onChange={(val) => state.yearMonth = val}
        ></MonthPicker>
      </div>
      <div className={css`display: flex; gap: 10px;`}>
        <LeftArrowButton
          onClick={() => state.yearMonth = lib.monthPlus(state.yearMonth, -1)}
        ></LeftArrowButton>
        <RightArrowButton
          onClick={() => state.yearMonth = lib.monthPlus(state.yearMonth, 1)}
        ></RightArrowButton>
      </div>
      <div>
        <Dropdown
          value={state.dropdownTableValue} width={'110px'} array={state.dropdownTableArray}
          onChange={(val) => state.dropdownTableValue = val}
        ></Dropdown>
      </div>
    </div>
    <div className={css`height: 900px;`}></div>
  </>
}

function App() {
  const state = useProxy(_state)
  onMount(state, useMount)
  onEffect(state, useEffect)
  return (
    <ConfigProvider
      wave={{ disabled: true }}
      theme={{
        token: { fontFamily: 'TAHOMA' },
        algorithm: state.isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: { Table: { cellPaddingBlockSM: 0, headerBorderRadius: 0 } },
      }}
    >
      {state.isLoading
        ? <Spin styles={{
          root: { backgroundColor: `${state.isDarkMode ? '#292929FF' : '#FFFFFFFF'}`, },
          indicator: { color: `${state.isDarkMode ? '#3F96FF' : '#3F96FF'}`, },
        }} fullscreen />
        : <div className={css`display: flex; justify-content: center; font-family: 'TAHOMA';`}>
          <div className={css`width: 355px; padding-left: 5px; padding-right: 5px;`}>
            <_App></_App>
          </div>
        </div>}
    </ConfigProvider>
  )
}

export default App
