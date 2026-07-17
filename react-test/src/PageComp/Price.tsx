import { css, cx } from '@emotion/css'
import { useProxy } from 'valtio/utils'
import { numeral } from '../Lib'
import { state as _state } from '../Store'

// @ts-ignore
enum Color {
  'white' = '#FFFFFFFF',
  'black' = '#292929FF',
  'whiteGray' = '#FFFFFF99',
  'blackGray' = '#505050FF',
  'red' = '#F23645FF',
  'green' = '#089981FF',
}

export const Price = () => {
  const state = useProxy(_state)

  const style = () => {
    const titleColor = state.isDarkMode ? Color.whiteGray : Color.blackGray
    let bgColor = Color.blackGray
    let chg24Hour = state.data?.hyper?.chg24Hour ?? 0
    if (chg24Hour > 0) { bgColor = Color.green }
    if (chg24Hour < 0) { bgColor = Color.red }
    return {
      container: css`
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        align-items: center;
        grid-row-gap: 10px;
        grid-column-gap: 10px;
      `,
      jsStart: css`
        justify-self: start;
      `,
      jsEnd: css`
        justify-self: end;
      `,
      titleFont: css`
        color: ${titleColor};
        font-size: 11px;
      `,
      font1: css`
        color: ${state.isDarkMode ? Color.white : Color.black};
        font-size: 16px;
      `,
      font2: css`
        color: ${state.isDarkMode ? Color.white : Color.black};
        font-size: 16px;
      `,
      font3: css`
        color: ${Color.white};
        font-size: 14px;
        background-color: ${bgColor};
        border-radius: 4px;
        width: 65px;
        height: 28px;
      `,
    }
  }
  const s = style()
  return <div style={{ userSelect: 'none' }} className={cx(s.container)}>
    <div className={cx(s.jsStart, s.titleFont)}>Name</div>
    <div className={cx(s.jsEnd, s.titleFont)}>Last Price</div>
    <div className={cx(s.jsEnd, s.titleFont)}>24h chg%</div>
    <div className={cx(s.jsStart, s.font1)}>BTCUSD</div>
    <div className={cx(s.jsEnd, s.font2)}>{numeral(state.data?.hyper?.price ?? 0).format('0,0.0')}</div>
    <div className={cx(s.jsEnd, s.font3, css`display: flex; justify-content: center; align-items: center;`)}>
      <div>{numeral(state.data?.hyper?.chg24Hour ?? 0).format('0.00%')}</div>
    </div>
  </div>
}