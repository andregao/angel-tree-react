import React, { createContext, useMemo, useReducer, useState } from 'react';

import Tree from './pages/Tree';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Commitment from './pages/Commitment';
import Admin from './pages/Admin';
import { initialState, reducer } from './services/state';

export const Context = createContext({});

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <BrowserRouter>
      <Switch>
        <Context.Provider value={contextValue}>
          <Route exact path='/'>
            <Tree />
          </Route>
          <Route path='/pledge/:childId' children={<Commitment />} />
          <Route path='/admin'>
            <Admin />
          </Route>
        </Context.Provider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
