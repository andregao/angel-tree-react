export const actions = {
  receiveTreeData: 'RECEIVE_TREE_DATA',
  receiveChildInfo: 'RECEIVE_CHILD_INFO',
  receiveDonorInfo: 'RECEIVE_DONOR_INFO',
};

export const initialTreeState = {};

export function treeReducer(state, { type, payload }) {
  switch (type) {
    case actions.receiveTreeData:
      // bypass state update if data is the same
      if (payload.updated === state.updated) {
        return state;
      }
      return { ...payload };

    default:
      throw new Error('invalid action dispatched');
  }
}

export const initialChildrenState = {
  donorInfo: { name: '', email: '', phone: '' },
};

export function childrenReducer(state, { type, payload }) {
  switch (type) {
    case actions.receiveChildInfo:
      return {
        ...state,
        [payload.id]: { ...state[payload.id], ...payload },
      };
    case actions.receiveDonorInfo:
      return {
        ...state,
        donorInfo: { ...state.donorInfo, [payload.name]: payload.value },
      };
    default:
      throw new Error('invalid action dispatched');
  }
}
