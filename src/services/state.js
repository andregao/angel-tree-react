export const actions = {
  receiveTreeData: 'RECEIVE_TREE_DATA',
  receiveChildInfo: 'RECEIVE_CHILD_INFO',
  receiveDonorInfo: 'RECEIVE_DONOR_INFO',
  receiveAdminSecret: 'RECEIVE_ADMIN_SECRET',
  receiveAdminData: 'RECEIVE_ADMIN_DATA',
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
  adminSecret: '',
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
        donorInfo: payload,
      };
    case actions.receiveAdminSecret:
      return {
        ...state,
        adminSecret: payload,
      };
    case actions.receiveAdminData:
      return {
        ...state,
        admin: payload,
      };
    default:
      throw new Error('invalid action dispatched');
  }
}
