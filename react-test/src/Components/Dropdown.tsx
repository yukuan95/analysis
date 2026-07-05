import { Dropdown as AntdDropdown, Button, ConfigProvider } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { css } from '@emotion/css'
import { useProxy } from 'valtio/utils'
import { state as _state } from '../Store'

type Props = { value: string; array: Array<string>; width: string; onChange: (res: string) => void }

function Dropdown({ value, array, width, onChange }: Props) {
  const items = array.map((item: string) => ({ label: item, key: item }))
  const menuProps = {
    items, onClick: (res: any) => onChange(res.key),
  }
  const state = useProxy(_state)
  return <ConfigProvider
    theme={{
      components: {
        Button: {
          defaultColor: state.isDarkMode ? '#FFFFFF' : '#000000',
          defaultHoverColor: state.isDarkMode ? '#FFFFFF' : '#000000',
          defaultActiveColor: state.isDarkMode ? '#FFFFFF' : '#000000',
        },
      },
    }}>
    <AntdDropdown menu={menuProps} trigger={['click']}>
      <Button className={css` width: ${width}; justify-content: space-between; `}
        icon={<DownOutlined />} iconPlacement="end">
        {array.find((item) => item === value) ? value : ''}
      </Button>
    </AntdDropdown>
  </ConfigProvider>
}

export { Dropdown }