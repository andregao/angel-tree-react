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
  receiveChildInfoAdmin: 'RECEIVE_CHILD_INFO_ADMIN',
  updateChildDetails: 'UPDATE_CHILD_DETAILS',
  deleteChild: 'DELETE_CHILD',
  updateDonationDetails: 'UPDATE_DONATION_DETAILS',
  deleteDonation: 'DELETE_DONATION',
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
      const newChildren = { ...state.children };
      newChildren.ids = [...state.children.ids, payload.id];
      newChildren[payload.id] = payload;
      return {
        ...state,
        children: newChildren,
      };
    case actions.receiveChildInfoAdmin:
      return {
        ...state,
        children: {
          ...state.children,
          [payload.id]: {
            ...state.children[payload.id],
            ...payload,
          },
        },
      };
    case actions.updateChildDetails:
      return {
        ...state,
        children: {
          ...state.children,
          [payload.id]: payload,
        },
      };
    case actions.deleteChild:
      return {
        ...state,
        children: {
          ...state.children,
          ids: state.children.ids.filter(id => id !== payload),
        },
      };
    case actions.deleteDonation:
      return {
        ...state,
        donations: {
          ...state.donations,
          ids: state.donations.ids.filter(id => id !== payload),
        },
      };
    case actions.updateDonationDetails:
      return {
        ...state,
        donations: {
          ...state.donations,
          [payload.id]: payload,
        },
      };
    default:
      throw new Error('invalid action dispatched');
  }
}
