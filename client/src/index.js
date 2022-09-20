import React from 'react';
import ReactDOM from 'react-dom/client';
import DataProvider from './redux/store';
import App from '~/App';
import GlobalStyles from '~/components/GlobalStyles';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <DataProvider>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </DataProvider>,
  // </React.StrictMode>,
);
