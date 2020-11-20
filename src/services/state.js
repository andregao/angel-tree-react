export const actions = {
  treeRefresh: 'TREE_REFRESH',
};

export const initialState = {};

export function reducer(state, { type, payload }) {
  switch (type) {
    case actions.treeRefresh:
      return { ...state, tree: payload };
    default:
      throw new Error('invalid action dispatched');
  }
}
