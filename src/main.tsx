import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './scrollbar.css'
import { GlobalContextProvider } from './Context/GlobalContext/GlobalContext.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <GlobalContextProvider>
      <App />
  </GlobalContextProvider>

)
