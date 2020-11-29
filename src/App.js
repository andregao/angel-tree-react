import React, { createContext, Suspense, useMemo, useReducer } from 'react';

import Tree from './pages/Tree';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
  childrenReducer,
  initialChildrenState,
  initialTreeState,
  treeReducer,
} from './services/state';
import Loading from './pages/Loading';

const Commitment = React.lazy(() => import('./pages/Donation'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Login = React.lazy(() => import('./pages/Login'));
const Success = React.lazy(() => import('./pages/Success'));
const PickAnother = React.lazy(() => import('./pages/PickAnother'));
export const TreeContext = createContext({});
export const ChildrenContext = createContext({});

function App() {
  // tree state setup
  const [treeState, treeDispatch] = useReducer(treeReducer, initialTreeState);
  const treeContextValue = useMemo(() => ({ treeState, treeDispatch }), [
    treeState,
  ]);

  // children state setup
  const [childrenState, childrenDispatch] = useReducer(
    childrenReducer,
    initialChildrenState
  );
  const childrenContextValue = useMemo(
    () => ({ childrenState, childrenDispatch }),
    [childrenState]
  );
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <ChildrenContext.Provider value={childrenContextValue}>
            <Route exact path='/'>
              <TreeContext.Provider value={treeContextValue}>
                <Tree />
              </TreeContext.Provider>
            </Route>
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
          </ChildrenContext.Provider>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
