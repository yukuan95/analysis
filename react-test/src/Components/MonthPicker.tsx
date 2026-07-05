import { DatePicker, Button, ConfigProvider } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { css } from '@emotion/css'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useProxy } from 'valtio/utils'
import { state as _state } from '../Store'

function getDateString(dateValue: any) {
  const date = dateValue.toDate()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return year + '-' + String(month).padStart(2, '0')
}

type Props = { value: string; width: string; onChange: (res: string) => void }

function MonthPicker({ value, width, onChange }: Props) {
  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(5, 7)) - 1
  let dayjsValue = dayjs().year(year).month(month)
  if (!dayjsValue.isValid()) {
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    dayjsValue = dayjs().year(year).month(month)
  }
  const [open, setOpen] = useState(false)
  const state = useProxy(_state)
  return <span>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultColor: state.isDarkMode ? '#FFFFFF' : '#000000',
            defaultHoverColor: state.isDarkMode ? '#FFFFFF' : '#000000',
            defaultActiveColor: state.isDarkMode ? '#FFFFFF' : '#000000',
            colorTextDisabled: state.isDarkMode ? '#FFFFFF' : '#000000',
            colorBgContainerDisabled: state.isDarkMode ? '#202020' : '#FFFFFF',
          },
        },
      }}
      wave={{ disabled: true }}>
      <Button
        iconPlacement="end"
        icon={<DownOutlined />}
        disabled={open ? true : false}
        onClick={() => setOpen(true)}
        className={css`
          width: ${width}; height: 32px;
          justify-content: space-between;
          cursor: pointer !important;
          position: absolute; z-index: 1;
        `}
      >
        <span>{getDateString(dayjsValue)}</span>
      </Button>
      <DatePicker
        open={open}
        picker="month"
        value={dayjsValue}
        inputReadOnly={true}
        onOpenChange={(open) => setOpen(open)}
        style={{ width: width, height: '32px' }}
        onChange={(newValue) => onChange(getDateString(newValue))}
      />
    </ConfigProvider>
  </span>
}

export { MonthPicker }