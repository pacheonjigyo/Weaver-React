import './index.css';

import { App } from './App';

import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import { AppContext, stores } from "./AppContext";
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <AppContext.Provider value={stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppContext.Provider>,

  document.getElementById('root')
);

reportWebVitals();