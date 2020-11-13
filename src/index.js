import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
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
        <BrowserRouter>
          <Switch>
            <Route exact path='/'>
              <App />
            </Route>
            <Route exact path='/'>
              <App />
            </Route>
            <Route path='/pledge/:childId' children={<Commitment />} />
            <Route path='/admin'>
              <Admin />
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
