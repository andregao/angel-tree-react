export const actions = {
  receiveTreeData: 'RECEIVE_TREE_DATA',
};

export const initialState = {};

export function reducer(state, { type, payload }) {
  switch (type) {
    case actions.receiveTreeData:
      if (payload.updated === state.tree?.updated) {
        return state;
      }
      return { ...state, tree: payload };
    default:
      throw new Error('invalid action dispatched');
  }
}
