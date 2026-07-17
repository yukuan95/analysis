export interface Data {
  analyseData: AnalyseData
  priceLog: PriceLog
  dateValue: DateValue[]
  errorLog: string
  hyper: Hyper
}

export interface AnalyseData {
  startTime: string
  startTimeReason: string
  analyseTime: string
  lever: number
  lastNMonth: LastNmonth[]
  minNMonth: MinNmonth[]
  orderMonth: OrderMonth[]
  orderYear: OrderYear[]
}

export interface LastNmonth {
  lastNMonthS: number
  avgMonth: number
  N: string
}

export interface MinNmonth {
  minNMonthArray: MinNmonthArray[]
  N: string
}

export interface MinNmonthArray {
  timeN: string
  valueN: number
}

export interface OrderMonth {
  perMonthS: number
  perMonthS2: number
  month: string
  orderMonthArray: OrderMonthArray[]
}

export interface OrderMonthArray {
  time: string
  nowPrice: number
  shortPrice: number
  longPrice: number
  isStart: boolean
  startTime: string
  reason: string
  status: string
  type: string
  preNowPrice: number
  preStatus: string
  preS: number
  maxPrice?: number
  maxPriceTime?: string
  minPrice?: number
  minPriceTime?: string
  maxMinChg?: number
  preLongPrice: number
  preLongPriceTime: string
  longChg?: number
  status2: string
  preStatus2: string
  preS2: number
}

export interface OrderYear {
  perYearS: number
  avgMonth: number
  year: string
}

export interface PriceLog {
  nowTime: string
  nowPrice: string
  shortPrice: string
  longPrice: string
  startTime: string
  accountAddress: string
}

export interface DateValue {
  date: string
  value: number
}

export interface Hyper {
  price?: string
  chg24Hour?: number
  accountValue: AccountValue[]
  totalPnL: TotalPnL[]
  userFills: UserFill[]
  position?: {
    entryPrice: string
    positionValue: string
    unrealizedPnl: string
  }
  candle?: CandleItem
  candleData?: Array<CandleItem>
}

export interface AccountValue {
  time: string
  value: number
}

export interface TotalPnL {
  time: string
  value: number
}

export interface UserFill {
  time: string
  side: string
  price: number
  size: number
  fee: number
  closedPnl: number
}

export interface CandleItem {
  open: number;
  close: number;
  high: number;
  low: number;
  time: number;
}
