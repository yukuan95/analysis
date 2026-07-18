import { Tooltip } from '../Components/Tooltip'
import { state as _state, } from '../Store'
import { useProxy } from 'valtio/utils'
import { v4 as uuidv4 } from 'uuid'
import { css } from '@emotion/css'
import * as lib from '../Lib'
import { Table } from 'antd'
import React from 'react'
const { Column } = Table

const heightCss = css`height: 30px;`

export const Table1 = () => {
  const state = useProxy(_state)
  const data = state.data?.hyper?.userFills?.filter((item) => {
    return item.time.startsWith(state.yearMonth)
  })?.map((item) => {
    const { closedPnl, fee, price, side, size, time, } = item
    return {
      key: uuidv4(), side, time,
      timeShort: time.slice(0, 16),
      fee: lib.formatNumber(fee, 5),
      size: lib.formatNumber(size, 5),
      price: lib.formatNumber(price, 1),
      closedPnl: lib.formatNumber(closedPnl, 5),
    }
  }) ?? []
  const timeZone = data.at(0)?.time?.slice(-3) ?? ''
  const heightCss = css`height: 30px;`
  return <>
    <Table size="small" pagination={false} bordered dataSource={data} >
      <Column
        align="center" title={timeZone ? `time(${timeZone})` : 'time'}
        className={heightCss} dataIndex="timeShort" render={(_, item) => (<>
          {item.time.slice(0, 16)}
        </>)}></Column>
      <Column className={heightCss} align="center" title="price" dataIndex="price" render={(_, item) => (<>
        <Tooltip title={getGrid(item, [['fee', 'fee'], ['pnl', 'closedPnl']])} placement='left'>
          {item.price}
        </Tooltip>
      </>)}></Column>
      <Column className={heightCss} align="center" title="side" dataIndex="side"></Column>
      <Column className={heightCss} align="center" title="size" dataIndex="size"></Column>
    </Table >
  </>
}

export const Table2 = () => {
  const state = useProxy(_state)
  const orderMonth = state.data?.analyseData?.orderMonth?.find(item => item.month === state.yearMonth)?.orderMonthArray ?? []
  const data: any = orderMonth.map((item) => {
    const { time, nowPrice, longPrice, status, preS, longChg, maxMinChg, status2, preS2 } = item
    return {
      key: uuidv4(), status, status2,
      time, timeShort: time.slice(0, 16),
      nowPrice: lib.formatNumber(nowPrice, 1),
      longPrice: lib.formatNumber(longPrice, 1),
      preS: lib.formatNumber(preS, 4),
      preS2: lib.formatNumber(preS2, 4),
      longChg: longChg ? lib.formatNumber(longChg * 100, 4) + '%' : null,
      maxMinChg: maxMinChg ? lib.formatNumber(maxMinChg * 100, 4) + '%' : null,
    }
  })
  const timeZone = data.at(0)?.time?.slice(-3) ?? ''
  return <>
    <Table size="small" pagination={false} bordered dataSource={data} >
      <Column
        align="center" title={timeZone ? `time(${timeZone})` : 'time'}
        className={heightCss} dataIndex="timeShort" render={(_, item) => (<>
          {item.time.slice(0, 16)}
        </>)}></Column>
      <Column className={heightCss} align="center" title="price" dataIndex="nowPrice" render={(_, item) => (<>
        <Tooltip title={getGrid(item,
          [['longPrice', 'longPrice'], ['longChg', 'longChg'], ['maxChg', 'maxMinChg'],
          ['status2', 'status2'], ['rate2', 'preS2'],]
        )} placement='left'>
          {item.nowPrice}
        </Tooltip>
      </>)}></Column>
      <Column className={heightCss} align="center" title="status" dataIndex="status"></Column>
      <Column className={heightCss} align="center" title="rate" dataIndex="preS"></Column>
    </Table >
  </>
}

export const Table3 = () => {

  return <></>
}

export const Table4 = () => {

  return <></>
}

export const Table5 = () => {

  return <></>
}

function getGrid(item: any, keys: Array<[string, string]>) {
  keys = keys.filter((key) => !!item[key[1]])
  return <>
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', justifyItems: 'center' }}>
      {
        keys.map((key: [string, string]) => (<React.Fragment key={`${item.key}${key[0]}${key[1]}`}>
          <div>{key[0]}</div><div style={{ whiteSpace: 'pre' }}> : </div><div>{item[key[1]]}</div>
        </React.Fragment>))
      }
    </div>
  </>
}