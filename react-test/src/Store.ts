import { proxy } from 'valtio';
import type { Data } from './Types'
import * as lib from './Lib'

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
    const themeMedia = window.matchMedia("(prefers-color-scheme: dark)")
    themeMedia.onchange = ({ matches }) => state.isDarkMode = matches
  }, [])
  useEffect(() => {
    document.body.style.backgroundColor = state.isDarkMode ? '#292929FF' : '#FFFFFFFF'
  }, [state.isDarkMode])
}

function onMount(state: StateType, useMount: any) {
  useMount(async () => {
    state.isLoading = true
    const res = await Promise.all([lib.getData(), lib.getCandleData(), lib.getFonts()])
    state.data = res[0]
    state.data.candleData = res[1]
    state.isLoading = false
  })
}

export { state, onEffect, onMount }
