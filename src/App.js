import React, { createContext, Suspense, useMemo, useReducer } from 'react';

import Tree from './pages/Tree';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { childrenReducer, initialState, treeReducer } from './services/state';
import Loading from './pages/Loading';

const Commitment = React.lazy(() => import('./pages/Donation'));
const Admin = React.lazy(() => import('./pages/Admin'));
export const TreeContext = createContext({});
export const ChildrenContext = createContext({});

function App() {
  // tree state setup
  const [treeState, treeDispatch] = useReducer(treeReducer, initialState);
  const treeContextValue = useMemo(() => ({ treeState, treeDispatch }), [
    treeState,
  ]);

  // children state setup
  const [childrenState, childrenDispatch] = useReducer(
    childrenReducer,
    initialState
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
            <Route path='/admin'>
              <Admin />
            </Route>
          </ChildrenContext.Provider>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
