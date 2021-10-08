import { all, spawn, call } from 'redux-saga/effects';
import crypto from './crypto';
const sagas = [
  ...crypto
];

/**
 * Root saga.
 */
export default function* rootSaga() {
  yield all(sagas.map((saga) => spawn(function* spawnSaga() {
    while (true) {
      try {
        yield call(saga);
        break;
      } catch (err) {
        console.log(err); // eslint-disable-line no-console
      }
    }
  })));
}
