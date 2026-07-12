import { createRoot } from 'react-dom/client'
import { injectGlobal } from '@emotion/css'
import 'antd/dist/reset.css'
import App from './App.tsx'

injectGlobal`
  @font-face {
    font-family: 'Tahoma';
    src: url('/analysis/TAHOMA.ttf') format('truetype');
    font-display: swap;
  }
`

createRoot(document.getElementById('root')!).render(
  <App />,
)
