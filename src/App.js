import React, { createContext, Suspense, useMemo, useReducer } from 'react';

import Tree from './pages/Tree';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
  appReducer,
  initialAppState,
  initialTreeState,
  treeReducer,
} from './services/state';
import Loading from './pages/Loading';

const Commitment = React.lazy(() => import('./pages/Donation'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Login = React.lazy(() => import('./pages/Login'));
const Success = React.lazy(() => import('./pages/Success'));
const PickAnother = React.lazy(() => import('./pages/PickAnother'));
const Waitlist = React.lazy(() => import('./pages/Waitlist'));
export const TreeContext = createContext({});
export const AppContext = createContext({});

function App() {
  // tree state setup
  const [treeState, treeDispatch] = useReducer(treeReducer, initialTreeState);
  const treeContextValue = useMemo(() => ({ treeState, treeDispatch }), [
    treeState,
  ]);

  // app state setup
  const [appState, appDispatch] = useReducer(appReducer, initialAppState);
  const appContextValue = useMemo(() => ({ appState, appDispatch }), [
    appState,
  ]);
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <AppContext.Provider value={appContextValue}>
            <TreeContext.Provider value={treeContextValue}>
              <Route exact path='/'>
                <Tree />
              </Route>
              <Route path='/waitlist'>
                <Waitlist />
              </Route>
            </TreeContext.Provider>
            <Route path='/donate/:childId'>
              <Commitment />
            </Route>
            <Route path='/success'>
              <Success />
            </Route>
            <Route path='/pick-another'>
              <PickAnother />
            </Route>
            <Route path='/admin'>
              <Admin />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
          </AppContext.Provider>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
