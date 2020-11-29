export const actions = {
  // tree actions
  receiveTreeData: 'RECEIVE_TREE_DATA',
  // app actions
  receiveChildInfo: 'RECEIVE_CHILD_INFO',
  receiveChildDetails: 'RECEIVE_CHILD_DETAILS',
  receiveDonorInfo: 'RECEIVE_DONOR_INFO',
  receiveAdminSecret: 'RECEIVE_ADMIN_SECRET',
  receiveChildrenData: 'RECEIVE_CHILDREN_DATA',
  receiveDonationsData: 'RECEIVE_DONATIONS_DATA',
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

export const initialAppState = {
  donorInfo: { name: '', email: '', phone: '' },
  adminSecret: '',
  children: null,
  donations: null,
};

export function appReducer(state, { type, payload }) {
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
    case actions.receiveChildrenData:
      return {
        ...state,
        children: payload,
      };
    case actions.receiveDonationsData:
      return {
        ...state,
        donations: payload,
      };
    case actions.receiveChildDetails:
      const id = payload.id;
      const newChildren = { ...state.children };
      newChildren.ids = [...state.children.ids, id];
      newChildren[id] = payload;
      return {
        ...state,
        children: newChildren,
      };
    default:
      throw new Error('invalid action dispatched');
  }
}
