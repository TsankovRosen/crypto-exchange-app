import {SET_CRYPTO_RESULT, SUBMIT_CRYPTO_SEARCH} from "../actions/crypto";

const INITIAL_STATE = {
  isLoading: false,
  list: {}
};

const crypto = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBMIT_CRYPTO_SEARCH:
      return {
        list: {},
        isLoading: true
      };

    case SET_CRYPTO_RESULT:
      return {
        ...state,
        isLoading: false,
        list: {
          ...state.list,
          [action.payload.domain]: { ...action.payload }
        }
      }

    default:
      return state;
  }
};

export default crypto;
