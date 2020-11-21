import React, { createContext, useMemo, useReducer } from 'react';

import Tree from './pages/Tree';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Commitment from './pages/Commitment';
import Admin from './pages/Admin';
import { childrenReducer, initialState, treeReducer } from './services/state';

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
      <Switch>
        <ChildrenContext.Provider value={childrenContextValue}>
          <Route exact path='/'>
            <TreeContext.Provider value={treeContextValue}>
              <Tree />
            </TreeContext.Provider>
          </Route>
          <Route path='/pledge/:childId' children={<Commitment />} />
          <Route path='/admin'>
            <Admin />
          </Route>
        </ChildrenContext.Provider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
