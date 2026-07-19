import { state as _state } from '../Store'
import { useRef, useEffect } from 'react'
import { useProxy } from 'valtio/utils'
import { css } from '@emotion/css'
import Chart from 'chart.js/auto'

const back = (isDarkMode: boolean) => {
  return css`
    background-color: ${isDarkMode ? '#1F262F' : '#F7F8F9'}; user-select: none;
  `
}

function getChartOption(type: '1' | '2', data: Array<{ time: string; value: number }>, isDarkMode: boolean): any {
  const red = '#F23645FF'
  const green = '#089981FF'
  const blue = '#4FC1FF'
  const whiteGray = '#FFFFFF99'
  const blackGray = '#505050FF'
  return {
    type: 'line', data: {
      labels: data.map((item) => item.time.slice(0, 16)),
      datasets: [{
        data: data.map((item) => item.value),
        pointRadius: 0, pointHoverRadius: 0, tension: 0.4,
        borderWidth: 2,
        backgroundColor: data.map((item) => {
          if (type === '1') {
            return blue
          }
          if (item.value > 0) {
            return green
          } else {
            return red
          }
        }),
        segment: {
          borderColor: (ctx: any) => {
            if (type === '1') {
              return blue
            }
            const value = ctx.p1.parsed.y
            return value > 0 ? green : red
          },
        }
      }]
    },
    options: {
      interaction: { mode: 'index', intersect: false },
      animation: false, plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: {
            color: isDarkMode ? whiteGray : blackGray,
            maxTicksLimit: 5, callback: function (value: any) {
              const label = this.getLabelForValue(value)
              return label.slice(5, 10)
            }
          } as any,
          grid: { display: false, }
        },
        y: {
          position: 'right',
          ticks: {
            color: isDarkMode ? whiteGray : blackGray,
          },
        }
      }
    }
  }
}

export const Chart1 = () => {
  const state = useProxy(_state)
  const totalBalance = (state.data?.dateValue ?? [])
    .map((item) => ({ time: item.date, value: item.value }))
  const chartEl = useRef({ totalBalanceChartEl: null as any })
  const chart = useRef({ totalBalanceChart: null as any })
  useEffect(() => {
    chartEl.current.totalBalanceChartEl = document.getElementById('totalBalanceChart')
    if (totalBalance.length > 0 && chart.current.totalBalanceChart) {
      chart.current.totalBalanceChart.destroy()
    }
    chart.current.totalBalanceChart = new Chart(
      chartEl.current.totalBalanceChartEl,
      getChartOption('1', totalBalance, state.isDarkMode)
    )
  }, [state.isDarkMode, totalBalance.length])
  return <div className={back(state.isDarkMode)}><canvas id="totalBalanceChart" height="130"></canvas></div>
}

export const Chart2 = () => {
  const state = useProxy(_state)
  const accountValue = state.data?.hyper?.accountValue ?? []
  const chartEl = useRef({ accountValueChartEl: null as any })
  const chart = useRef({ accountValueChart: null as any })
  useEffect(() => {
    chartEl.current.accountValueChartEl = document.getElementById('accountValueChart')
    if (accountValue.length > 0 && chart.current.accountValueChart) {
      chart.current.accountValueChart.destroy()
    }
    chart.current.accountValueChart = new Chart(
      chartEl.current.accountValueChartEl,
      getChartOption('1', accountValue, state.isDarkMode)
    )
  }, [state.isDarkMode, accountValue.length])
  return <div className={back(state.isDarkMode)}><canvas id="accountValueChart" height="130"></canvas></div>
}

export const Chart3 = () => {
  const state = useProxy(_state)
  const totalPnL = state.data?.hyper?.totalPnL ?? []
  const chartEl = useRef({ totalPnLChartEl: null as any })
  const chart = useRef({ totalPnLChart: null as any })
  useEffect(() => {
    chartEl.current.totalPnLChartEl = document.getElementById('totalPnLChart')
    if (totalPnL.length > 0 && chart.current.totalPnLChart) {
      chart.current.totalPnLChart.destroy()
    }
    chart.current.totalPnLChart = new Chart(
      chartEl.current.totalPnLChartEl,
      getChartOption('2', totalPnL, state.isDarkMode)
    )
  }, [state.isDarkMode, totalPnL.length])
  return <div className={back(state.isDarkMode)}><canvas id="totalPnLChart" height="130"></canvas></div>
}