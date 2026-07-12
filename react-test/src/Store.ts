import { proxy } from 'valtio';
import type { Data } from './Types'
import * as lib from './Lib'
// import a1 from './getData'
// import a2 from './getCandleData'

type StateType = {
  isDarkMode: boolean,
  isLoading: boolean,
  yearMonth: string,
  dropdownTableArray: Array<string>,
  dropdownTableValue: string,
  dropdownGraphArray: Array<string>,
  dropdownGraphValue: string,
  data?: Data,
}

const stateInit: StateType = {
  isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  isLoading: false,
  dropdownGraphArray: ['Total Balance', 'Account Value', 'Total PnL'],
  dropdownGraphValue: 'Total Balance',
  yearMonth: lib.getNowStringTime().slice(0, 7),
  dropdownTableArray: ['Analysis', 'Hyper'],
  dropdownTableValue: 'Analysis',
  data: undefined,
}

const state = proxy(stateInit)

function onEffect(state: StateType, useEffect: any) {
  useEffect(() => {
    document.body.style.backgroundColor = state.isDarkMode ? '#292929FF' : '#FFFFFFFF'
  }, [state.isDarkMode])
}

function onMount(state: StateType, useMount: any) {
  useMount(async () => {
    state.isLoading = true
    const res: any = await Promise.all([lib.getData(), lib.getCandleData()])
    if (res[0] && res[1]) {
      res[0].candleData = res[1]
      state.data = res[0]
    } else {
      throw 'onMount get error'
    }

    // state.isLoading = true
    // const res: any = await Promise.all([new Promise(res => res(a1)), new Promise(res => res(a2))])
    // if (res[0] && res[1]) {
    //   res[0].candleData = res[1]
    //   state.data = res[0]
    // } else {
    //   throw 'onMount get error'
    // }

    state.isLoading = false
    initTheme(state)
    initWebsocket(state)
  })
}

function initTheme(state: StateType) {
  const themeMedia = window.matchMedia("(prefers-color-scheme: dark)")
  themeMedia.onchange = ({ matches }) => state.isDarkMode = matches
}

function initWebsocket(state: StateType) {
  if (state.data?.priceLog?.accountAddress && state.data?.hyper) {
    const hyper = state.data!.hyper
    lib.getWsData(state.data.priceLog.accountAddress, (data: any) => {
      if (data.channel === 'allMids') {
        hyper.price = data.price
      }
      if (data.channel === 'candle') {
        hyper.candleArray ? hyper.candleArray.push(data.data) : hyper.candleArray = [data.data]
      }
      if (data.channel === 'clearinghouseState') {
        hyper.position = data.position
      }
    })
  }
}

export { state, onEffect, onMount }
