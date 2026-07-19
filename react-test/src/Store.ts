import { proxy } from 'valtio';
import type { Data } from './Types'
import * as lib from './Lib'

export type StateType = {
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
  isLoading: true,
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
    initTheme(state)
    state.isLoading = true
    state.data = await lib.getData()
    state.isLoading = false
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
        hyper.candle = data.candleData
      }
      if (data.channel === 'clearinghouseState') {
        hyper.position = data.position
      }
    })
  }
}

export { state, onEffect, onMount }
