import { LeftArrowButton, RightArrowButton } from './Components/ArrowButton'
import { state as _state, onMount, onEffect } from './Store'
import { Switch, Spin, ConfigProvider, theme } from 'antd'
import { MonthPicker } from './Components/MonthPicker'
import { Dropdown } from './Components/Dropdown'
import { Tooltip } from './Components/Tooltip'
import { useEffect, useState } from 'react'
import { useMount } from "@reactuses/core"
import { Candle } from './PageComp/Candle'
import { Price } from './PageComp/Price'
import { useProxy } from 'valtio/utils'
import { css } from '@emotion/css'
import * as lib from './Lib'

function _App() {
  const state = useProxy(_state)
  const startTimeReason = state.data?.analyseData?.startTimeReason ?? ''
  const startTime = state.data?.analyseData?.startTime ?? ''
  const isError = () => {
    if (state.data?.errorLog) {
      return true
    }
    if (state.data?.analyseData?.analyseTime) {
      const analyseTime = lib.stringTimeToMilliTime(state.data.analyseData.analyseTime)
      const nowTime = lib.stringTimeToMilliTime(lib.getNowStringTime())
      if (nowTime - analyseTime > 15 * 60 * 1000) {
        return true
      }
    }
    return false
  }
  const [hour, setHour] = useState('')
  useMount(async () => {
    while (true) {
      setHour(lib.timeHoursC(startTime))
      await lib.sleep(2000)
    }
  })

  const [yearMonthRate, setYearMonthRate] = useState('')
  const [yearMonthRate2, setYearMonthRate2] = useState('')
  useEffect(() => {
    const rate = state.data?.analyseData?.orderMonth?.find?.((item) => {
      return item.month === state.yearMonth
    })?.perMonthS ?? ''
    const rate2 = state.data?.analyseData?.orderMonth?.find?.((item) => {
      return item.month === state.yearMonth
    })?.perMonthS2 ?? ''
    setYearMonthRate(rate ? lib.toFixedString(rate, 4) : lib.toFixedString(1, 4))
    setYearMonthRate2(rate2 ? lib.toFixedString(rate2, 4) : lib.toFixedString(1, 4))
  }, [state.yearMonth])
  return <>
    <div className={css`margin-top: 20px;`}></div>
    <div className={css`display: flex; justify-content: space-between;`}>
      <Tooltip title={<div className={css`display: flex; align-items: center; flex-direction: column; `}>
        <div>{startTimeReason.split(',')?.[0]}</div>
        <div>{startTimeReason.split(',')?.[1]}</div>
      </div>}>
        <span className={css`user-select: none;`}>
          <div className={css`display: flex; align-items: center; gap: 5px;`}>
            <span>{lib.timeSlice(startTime, true)}</span>
            {hour ? <span>{hour}</span> : <></>}
            <span className={css`color: ${isError() ? '#F23645FF' : '#089981FF'};`}>●</span>
          </div>
        </span>
      </Tooltip>
      <Switch
        checked={state.isDarkMode}
        onChange={() => state.isDarkMode = !state.isDarkMode}
        checkedChildren="Dark" unCheckedChildren="Light" />
    </div>
    <div className={css`margin-top: 20px;`}></div>
    <div><Price></Price></div>
    <div className={css`margin-top: 10px;`}></div>
    <div className={css`height: 1px; width: 345px; border-radius: 2px; background-color: #505050FF;`}></div>
    <div className={css`margin-top: 10px;`}></div>
    <div><Candle></Candle></div>
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
          value={state.yearMonth} width={'165px'} onChange={(val) => state.yearMonth = val}
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
    </div>
    <div className={css`margin-top: 20px;`}></div>
    <div className={css`display: flex; justify-content: space-between; align-items: center;`}>
      <div className={css`display: flex; gap: 20px;`}>
        <Tooltip title={yearMonthRate2}>
          <span className={css`user-select: none;`}>{yearMonthRate}</span>
        </Tooltip>
        <Tooltip title={<>
          <div>{state.data?.hyper?.price ?? ''}</div>
          <div>{state.data?.hyper?.position?.entryPrice ?? ''}</div>
        </>}>
          <span className={css`user-select: none; display: flex;`}>
            <div>{state.data?.hyper?.position?.positionValue ?? ''}</div>
            <div className={css`padding-left: 5px; padding-right: 5px;`}> | </div>
            <div>{state.data?.hyper?.position?.unrealizedPnl ?? ''}</div>
          </span>
        </Tooltip>
      </div>
      <Dropdown
        value={state.dropdownTableValue} width={'106px'} array={state.dropdownTableArray}
        onChange={(val) => state.dropdownTableValue = val}
      ></Dropdown>
    </div >

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
      {state.isLoading ?
        <Spin styles={{
          root: { backgroundColor: `${state.isDarkMode ? '#292929FF' : '#FFFFFFFF'}`, },
          indicator: { color: `${state.isDarkMode ? '#3F96FF' : '#3F96FF'}`, },
        }} fullscreen /> :
        <div className={css`display: flex; justify-content: center; font-family: 'TAHOMA';`}>
          <div className={css`min-width: 355px; padding-left: 5px; padding-right: 5px;`}>
            <_App></_App>
          </div>
        </div>}
    </ConfigProvider>
  )
}

export default App
