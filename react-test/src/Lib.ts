import type { Hyper, Data, CandleItem } from './Types'
import { Decimal } from "decimal.js"
import _numeral from 'numeral'
import JSZip from 'JSZip'

const numeral = (_numeral as any).default || _numeral
const InfoUrl = 'https://api.hyperliquid.xyz/info'
const DataUrl = 'https://bucket-20260428.oss-ap-northeast-1.aliyuncs.com/data.zip'
const WsUrl = 'wss://api.hyperliquid.xyz/ws'

export function add(n1: number, n2: number): number {
  return Number(Decimal(n1).add(Decimal(n2)))
}

export function toFixedNumber(f: number | string, n: number): number {
  return toNumber(toFixedString(f, n))
}

export function toFixedString(value: number | string, precision: number): string {
  const zeros = '0'.repeat(precision)
  const pattern = precision > 0 ? `0.${zeros}` : '0'
  return numeral(value).format(pattern)
}

export function formatNumber(value: number | string, precision: number): string {
  const zeros = '0'.repeat(precision)
  const pattern = precision > 0 ? `0,0.${zeros}` : '0,0'
  return numeral(value).format(pattern)
}

export function toNumber(f: number | string): number {
  const res = Number(f)
  console.assert(!isNaN(res))
  return res
}

export async function fetchJson(data: { url: string, headers?: any, method?: any, body?: any }): Promise<any> {
  let { url, headers, method, body } = data
  headers = headers ?? { 'Content-Type': 'application/json' }
  method = method ?? 'POST'
  body = body ?? {}
  let res = await fetch(url, { method, headers, body: JSON.stringify(body) })
  return await res.json()
}

export async function getCandleData(): Promise<Array<CandleItem>> {
  const res: any = await fetchJson({
    url: InfoUrl, body: {
      "type": "candleSnapshot",
      "req": {
        "coin": "BTC", "interval": "15m", "endTime": getNowMilliTime(),
        "startTime": getNowMilliTime() - timesToMilli({ days: 50 }),
      }
    }
  })
  return res
}

export async function getHyperData(address: string): Promise<Hyper> {
  const [portfolio, userFills] = await Promise.all([fetchJson({
    url: InfoUrl, method: 'POST',
    body: { "type": "portfolio", "user": address }
  }), fetchJson({
    url: InfoUrl, method: 'POST',
    body: { "type": "userFills", "user": address }
  })])
  const his = portfolio?.find((item: any) => item?.[0] === 'allTime')?.[1] ?? {}
  const accountValueHistory = his.accountValueHistory ?? []
  const pnlHistory = his.pnlHistory ?? []
  const accountValue = accountValueHistory.map((item: any) => {
    return { time: milliTimeToStringTime(item[0]), value: Number(item[1]) }
  })
  const totalPnL = pnlHistory.map((item: any) => {
    return { time: milliTimeToStringTime(item[0]), value: Number(item[1]) }
  })
  let data = userFills
  data = data.filter((item: any) => item.coin === 'BTC').map((item: any) => {
    let side = item.side
    if (item.side === 'A') {
      side = 'SHORT'
    }
    if (item.side === 'B') {
      side = 'LONG'
    }
    return {
      time: milliTimeToStringTime(item.time),
      side: side, price: Number(item.px),
      closedPnl: Number(item.closedPnl),
      fee: Number(item.fee), size: Number(item.sz),
      dir: item.dir
    }
  })
  data = data.reverse()
  const m = new Map<string, Array<any>>()
  for (const item of data) {
    const key = item.time + item.side
    if (m.has(key)) {
      m.get(key)?.push(item)
    } else {
      m.set(key, [item])
    }
  }
  data = []
  for (const value of m.values()) {
    const time = value[0].time
    let side = value[0].side
    if (value.every((item) => item.dir === 'Close Long')) {
      side = 'Hedge'
    }
    if (value.every((item) => item.dir === 'Close Short')) {
      side = 'Hedge'
    }
    const priceTotal = value.map((item) => item.price).reduce((a, b) => add(a, b), 0)
    const price = Number.parseInt('' + priceTotal / value.length)
    const size = value.map((item) => item.size).reduce((a, b) => add(a, b), 0)
    const fee = value.map((item) => item.fee).reduce((a, b) => add(a, b), 0)
    const closedPnl = value.map((item) => item.closedPnl).reduce((a, b) => add(a, b), 0)
    data.push({
      time, side, price, size, fee, closedPnl,
    })
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i].closedPnl === 0) {
      if (data[i - 1]) {
        data[i - 1].side = 'Hedge'
      }
    }
  }
  return {
    accountValue, totalPnL, userFills: data
  }
}

export async function getData(): Promise<Data> {
  const url = DataUrl
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error(`error: ${response.status}`)
  const zipBlob = await response.blob()
  const zip = new JSZip()
  const unpackedZip = await zip.loadAsync(zipBlob)
  const data: any = {}
  for (const [relativePath, fileObj] of Object.entries(unpackedZip.files)) {
    if (fileObj.dir) continue
    const textContent = await fileObj.async('string')
    Array.of('analyseData', 'priceLog', 'dateValue').forEach((item) => {
      if (relativePath.includes(`${item}.json`)) {
        data[item] = JSON.parse(textContent)
      }
    })
    if (relativePath.includes('errorLog.txt')) {
      data['errorLog'] = textContent.trim()
    }
  }
  const address = data?.priceLog?.accountAddress ?? ''
  if (address) {
    data.hyper = await getHyperData(address)
  }
  data.analyseData.analyseTime = stringTimeWithZone(data.analyseData.analyseTime)
  data.analyseData.startTime = stringTimeWithZone(data.analyseData.startTime)
  data.priceLog.nowTime = stringTimeWithZone(data.priceLog.nowTime)
  data.priceLog.startTime = stringTimeWithZone(data.priceLog.startTime)
  Object.values(data.analyseData.orderFormMonth).forEach((item: any) => {
    item.array.forEach((dataItem: any) => {
      dataItem.time = stringTimeWithZone(dataItem.time)
      dataItem.startTime = stringTimeWithZone(dataItem.startTime)
      if (dataItem.maxPriceTime) {
        dataItem.maxPriceTime = stringTimeWithZone(dataItem.maxPriceTime)
      }
      if (dataItem.minPriceTime) {
        dataItem.minPriceTime = stringTimeWithZone(dataItem.minPriceTime)
      }
      dataItem.preLongPriceTime = stringTimeWithZone(dataItem.preLongPriceTime)
    })
  })
  data.dateValue.forEach((item: any) => {
    item.date = stringTimeWithZone(item.date)
  })
  const orderMonth: any[] = []
  Object.keys(data.analyseData.orderFormMonth).forEach((key) => {
    const item = data.analyseData.orderFormMonth[key]
    item.month = key
    item.orderMonthArray = item.array
    delete item.array
    orderMonth.push(item)
  })
  data.analyseData.orderMonth = orderMonth
  delete data.analyseData.orderFormMonth

  const minNMonth: any[] = []
  Object.keys(data.analyseData.minNMonth).forEach((key) => {
    const minNMonthArray = data.analyseData.minNMonth[key]
    minNMonth.push({ minNMonthArray, N: key })
  })
  data.analyseData.minNMonth = minNMonth

  const lastNMonth: any[] = []
  Object.keys(data.analyseData.lastNMonth).forEach((key) => {
    const { lastNMonthS, avgMonth } = data.analyseData.lastNMonth[key]
    lastNMonth.push({ lastNMonthS, avgMonth, N: key })
  })
  data.analyseData.lastNMonth = lastNMonth

  const orderYear: any[] = []
  Object.keys(data.analyseData.orderFormYear).forEach((key) => {
    const { perYearS, avgMonth } = data.analyseData.orderFormYear[key]
    orderYear.push({ perYearS, avgMonth, year: key })
  })
  data.analyseData.orderYear = orderYear
  delete data.analyseData.orderFormYear
  return data
}

export function getWsData(accountAddress: string, onmessage: (data: any) => void) {
  const socket = new WebSocket(WsUrl)
  socket.onopen = () => {
    socket.send(JSON.stringify({
      "method": "subscribe",
      "subscription": { "type": "allMids" }
    }))
    socket.send(JSON.stringify({
      "method": "subscribe",
      "subscription": {
        "type": "candle",
        "coin": "BTC",
        "interval": "15m",
      }
    }))
    socket.send(JSON.stringify({
      "method": "subscribe",
      "subscription": {
        "type": "clearinghouseState",
        "user": accountAddress,
      }
    }))
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.channel === 'allMids') {
      const price = Number.parseFloat(data?.data?.mids?.BTC)
      if (!Number.isNaN(price)) {
        onmessage({ channel: 'allMids', price: formatNumber(price, 1) })
      }
    }
    if (data.channel === 'candle') {
      if (data?.data) {
        onmessage({ channel: 'candle', data: data.data })
      }
    }
    if (data.channel === 'clearinghouseState') {
      const assetPositions = data.data.clearinghouseState?.assetPositions ?? []
      const item = assetPositions.find((item: any) => item.position?.coin === 'BTC')
      if (item.position) {
        let { szi, entryPx, positionValue, unrealizedPnl } = item.position
        if (szi.at(0) === '-') {
          positionValue = '-' + positionValue
        }
        onmessage({
          channel: 'clearinghouseState', position: {
            entryPrice: formatNumber(entryPx, 1),
            positionValue: formatNumber(toFixedNumber(positionValue, 4) / 6, 2),
            unrealizedPnl: formatNumber(unrealizedPnl, 2),
          }
        })
      }
    }
  }
}

export function stringTimeWithZone(time: string): string {
  return milliTimeToStringTime(stringTimeToMilliTime(time))
}

export function getNowMilliTime(): number {
  return new Date().getTime()
}

export function getNowStringTime(timezone?: number): string {
  timezone = timezone ?? getTimezone()
  return milliTimeToStringTime(new Date().getTime(), timezone)
}

export function stringTimeToMilliTime(stringTime: string): number {
  console.assert(stringTime.length === 27)
  const temp = stringTime.slice(0, 23) + stringTime.slice(24, 27)
  return new Date(temp).getTime()
}

export function timezoneToString(timezone: number): string {
  const temp = timezone >= 0 ? '+' + timezone : '-' + timezone
  return temp.length === 2 ? temp[0] + '0' + temp[1] : temp
}

export function milliTimeToStringTime(milliTime: number, timezone?: number): string {
  timezone = timezone ?? getTimezone()
  console.assert(!isNaN(Number(timezone)))
  console.assert(timezone <= 12 && timezone >= -12)
  timezone = Number.parseInt(String(timezone))
  const temp = new Date(milliTime + timesToMilli({ hours: timezone })).toISOString()
  const stringTime = `${temp.slice(0, 10)} ${temp.slice(11, 23)} ${timezoneToString(timezone)}`
  console.assert(stringTime.length === 27)
  return stringTime
}

export function stringTimePlus(stringTime: string, times: { days?: number, hours?: number, minutes?: number, seconds?: number }): string {
  return milliTimeToStringTime(stringTimeToMilliTime(stringTime) + timesToMilli(times))
}

export function getTimezone() {
  return new Date().getTimezoneOffset() / (-60)
}

export function timesToMilli(times: { days?: number, hours?: number, minutes?: number, seconds?: number }): number {
  const days = (times.days ?? 0) * 24 * 60 * 60 * 1000
  const hours = (times.hours ?? 0) * 60 * 60 * 1000
  const minutes = (times.minutes ?? 0) * 60 * 1000
  const seconds = (times.seconds ?? 0) * 1000
  return days + hours + minutes + seconds
}

export function timesToMinute(times: { days?: number, hours?: number, minutes?: number, seconds?: number }): number {
  return Math.floor(timesToMilli(times) / 1000 / 60)
}

export function timesToSecond(times: { days?: number, hours?: number, minutes?: number, seconds?: number }): number {
  return Math.floor(timesToMilli(times) / 1000)
}

export function monthPlus(yearMonth: string, n: number): string {
  let year = Number.parseInt(yearMonth.slice(0, 4))
  let month = Number.parseInt(yearMonth.slice(5, 7))
  month += n
  while (month > 12) {
    month -= 12
    year += 1
  }
  while (month < 1) {
    month += 12
    year -= 1
  }
  return year + '-' + (String(month).length === 1 ? `0${month}` : `${month}`)
}

export function timeSlice(time: string, withTimezone: boolean = false): string {
  if (!time) {
    return ''
  }
  if (withTimezone === false) {
    return time.slice(0, 16)
  } else {
    return time.slice(0, 16) + ' ' + getTimezoneFromTime(time)
  }
}

export function getTimezoneFromTime(time: string): string {
  if (!time) {
    return ''
  }
  return time.slice(-3)
}

export function timeHoursC(startTime: string): string {
  const nowTime = getNowStringTime()
  if (!(nowTime && startTime)) {
    return ''
  }
  const sa = stringTimeToMilliTime(startTime) - stringTimeToMilliTime(nowTime)
  const res = toFixedNumber(sa / 1000 / 60 / 60, 4)
  const n1 = Number.parseInt(String(res))
  const n2 = Number.parseInt(String(60 * (res - n1)))
  if (res > 0) {
    return String(n1).padStart(2, '0') + ':' + String(n2).padStart(2, '0')
  } else {
    return ''
  }
}

export function sleep(n: number): Promise<void> {
  return new Promise(res => setTimeout(res, n))
}