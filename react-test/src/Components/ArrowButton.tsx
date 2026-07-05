import { Button } from 'antd'
import { css } from '@emotion/css'

type Props = { onClick: () => void }

function getSvg(name: string) {
  if (name === 'left') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        viewBox="0 0 16 16">
        <path
          d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
      </svg>
    )
  }
  if (name === 'right') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        viewBox="0 0 16 16">
        <path
          d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
      </svg>
    )
  }
  throw 'name error'
}

function arrowButton(name: string, onClick: () => void) {
  return <>
    <Button onClick={onClick}>
      <div className={css` 
        display: flex; flex-direction: row; justify-content: center; align-items: center; 
      `}>{getSvg(name)}</div>
    </Button>
  </>
}

function LeftArrowButton({ onClick }: Props) {
  return arrowButton('left', onClick)
}

function RightArrowButton({ onClick }: Props) {
  return arrowButton('right', onClick)
}

export { LeftArrowButton, RightArrowButton }