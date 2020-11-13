import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router } from '@reach/router';
import Commitment from './pages/Commitment';
import { StylesProvider } from '@material-ui/core/styles';
import Admin from './pages/Admin';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import cyan from '@material-ui/core/colors/cyan';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: pink[700],
    },
    secondary: {
      main: cyan[900],
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Router>
          <App path='/' />
          <Commitment path='pledge/:childId' />
          <Admin path='admin/' />
        </Router>
      </ThemeProvider>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
