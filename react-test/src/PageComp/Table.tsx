import React, { useMemo, useState } from 'react'
import { Tooltip } from '../Components/Tooltip'
import { state as _state } from '../Store'
import { useProxy } from 'valtio/utils'
import { v4 as uuidv4 } from 'uuid'
import { css } from '@emotion/css'
import * as lib from '../Lib'
import { Table } from 'antd'
const { Column } = Table

const heightCss = css`height: 30px;`

export const Table1 = () => {
  const state = useProxy(_state)
  const data = useMemo(() => {
    return state.data?.hyper?.userFills?.filter((item) => {
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
  }, [state.yearMonth])
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
        <Tooltip title={getGrid(item, [['fee', 'fee'], ['size', 'size']])} placement='left'>
          {item.price}
        </Tooltip>
      </>)}></Column>
      <Column className={heightCss} align="center" title="side" dataIndex="side"></Column>
      <Column className={heightCss} align="center" title="pnl" dataIndex="closedPnl"></Column>
    </Table >
  </>
}

export const Table2 = () => {
  const state = useProxy(_state)
  const [hidden, setHidden] = useState(true)
  const data = useMemo(() => {
    const orderMonth = state.data?.analyseData?.orderMonth?.find(item => item.month === state.yearMonth)?.orderMonthArray ?? []
    return orderMonth.map((item) => {
      const { isStart, time, nowPrice, longPrice, status, preS, longChg, maxMinChg, status2, preS2 } = item
      return {
        key: uuidv4(), status, status2, isStart,
        time, timeShort: time.slice(0, 16),
        nowPrice: lib.formatNumber(nowPrice, 1),
        longPrice: lib.formatNumber(longPrice, 1),
        preS: lib.formatNumber(preS, 4),
        preS2: lib.formatNumber(preS2, 4),
        longChg: longChg ? lib.formatNumber(longChg * 100, 4) + '%' : null,
        maxMinChg: maxMinChg ? lib.formatNumber(maxMinChg * 100, 4) + '%' : null,
      }
    })
  }, [state.yearMonth])
  const data2 = useMemo(() => {
    return data.filter((item: any, index: any) => {
      return !(data[index - 1]?.isStart === false && item.isStart === false)
    })
  }, [data])
  const timeZone = data.at(0)?.time?.slice(-3) ?? ''
  return <>
    <Table size="small" pagination={false} bordered dataSource={hidden ? data2 : data} >
      <Column
        align="center" title={timeZone ? `time(${timeZone})` : 'time'}
        className={heightCss} dataIndex="timeShort" render={(_, item) => (<>
          {item.time.slice(0, 16)}
        </>)}></Column>
      <Column className={heightCss} align="center" title="price" dataIndex="nowPrice"
        render={(_, item) => (<>
          <Tooltip title={getGrid(item,
            [['longPrice', 'longPrice'], ['longChg', 'longChg'], ['maxChg', 'maxMinChg'],
            ['status2', 'status2'], ['rate2', 'preS2']]
          )} placement='left'>
            {item.nowPrice}
          </Tooltip>
        </>)}>
      </Column>
      <Column className={heightCss} align="center" title="status" dataIndex="status"></Column>
      <Column className={heightCss} align="center" title={<>
        <div className={css`user-select: none;`} onDoubleClick={() => setHidden(!hidden)}>rate</div>
      </>} dataIndex="preS"></Column>
    </Table >
  </>
}

export const Table3 = () => {
  const state = useProxy(_state)
  const data = useMemo(() => {
    const orderYear = state.data?.analyseData?.orderYear ?? []
    return orderYear.map((item) => {
      return {
        key: uuidv4(), year: item.year,
        avgMonth: lib.formatNumber(item.avgMonth, 4),
        perYearS: lib.formatNumber(item.perYearS, 4),
      }
    }).reverse()
  }, [])
  return <Table size="small" pagination={false} bordered dataSource={data} >
    <Column className={heightCss} width='33.333%' align="center" title="year" dataIndex="year"></Column>
    <Column className={heightCss} width='33.333%' align="center" title="rate" dataIndex="perYearS"></Column>
    <Column className={heightCss} width='33.333%' align="center" title="avgMonth" dataIndex="avgMonth"></Column>
  </Table>
}

export const Table4 = () => {
  const state = useProxy(_state)
  const data = useMemo(() => {
    const lastNMonth = state.data?.analyseData?.lastNMonth ?? []
    return lastNMonth.map((item) => {
      return {
        key: uuidv4(), N: item.N,
        avgMonth: lib.formatNumber(item.avgMonth, 4),
        lastNMonthS: lib.formatNumber(item.lastNMonthS, item.lastNMonthS > 1000 ? 0 : 2),
      }
    })
  }, [])
  return <Table size="small" pagination={false} bordered dataSource={data} >
    <Column className={heightCss} width='33.333%' align="center" title="lastNMonth" dataIndex="N"></Column>
    <Column className={heightCss} width='33.333%' align="center" title="rate" dataIndex="lastNMonthS"></Column>
    <Column className={heightCss} width='33.333%' align="center" title="avgMonth" dataIndex="avgMonth"></Column>
  </Table>
}

export const Table5 = () => {
  const state = useProxy(_state)
  const getNumberLength = (n: number) => {
    const length = String(Number.parseInt(n + '')).length
    if (6 - length > 0) { return 6 - length }
    else { return 0 }
  }
  const data = useMemo(() => {
    const minNMonth = state.data?.analyseData?.minNMonth ?? []
    const _data: any[] = []
    minNMonth.forEach((item) => {
      item.minNMonthArray.forEach((arrayItem, index) => {
        _data.push({
          key: uuidv4(), isFirst: index === 0,
          N: item.N, timeN: arrayItem.timeN,
          valueN: lib.formatNumber(arrayItem.valueN, getNumberLength(arrayItem.valueN)),
        })
      })
    })
    return _data
  }, [])
  return <Table size="small" pagination={false} bordered dataSource={data} >
    <Column className={heightCss} align="center" title="monthN" dataIndex="N"></Column>
    <Column className={heightCss} align="center" title="timeN" dataIndex="timeN"
      render={(_, item) => (<span>
        <span>{item.isFirst ?
          <span className={css`color: #01A9F4;`}>●</span> :
          <span className={css`color: transparent;`}>●</span>}
        </span>
        <span className={css`padding-left: 5px;`}>{item.timeN}</span>
      </span>)}>
    </Column>
    <Column className={heightCss} align="center" title="valueN" dataIndex="valueN"></Column>
  </Table>
}

function getGrid(item: any, keys: Array<[string, string]>) {
  keys = keys.filter((key) => item[key[1]] !== null)
  return <>
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', justifyItems: 'center' }}>
      {
        keys.map((key: [string, string]) => (<React.Fragment key={`${item.key}${key[0]}${key[1]}`}>
          <div>{key[0]}</div><div style={{ whiteSpace: 'pre' }}> : </div><div>{String(item[key[1]])}</div>
        </React.Fragment>))
      }
    </div>
  </>
}