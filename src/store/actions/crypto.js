export const SUBMIT_CRYPTO_SEARCH = 'SUBMIT_CRYPTO_SEARCH';
export const SET_CRYPTO_RESULT = 'SET_CRYPTO_RESULT';

export const submitCryptoSearch = (payload) => ({
  type: SUBMIT_CRYPTO_SEARCH,
  payload
});

export const setCrypto = (payload) => ({
  type: SET_CRYPTO_RESULT,
  payload
});
