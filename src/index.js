import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import App from './App.js'
import store from './redux/Store'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Provider store={store} >
        <App />
      </Provider>
    </BrowserRouter>
)
