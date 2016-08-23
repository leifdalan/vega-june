export const ADD_CACHE = 'ADD_CACHE'
const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_CACHE:
      return {
        ...state,
        [action.payload.key]: {
          ttl: action.payload.ttl,
          time: action.payload.time
        }
      };
    default:
      return state;
  }
}
