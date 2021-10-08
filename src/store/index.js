import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas/index';
const sagaMiddleware = createSagaMiddleware();

let composeEnhancers = compose;

if (process.env.NODE_ENV === 'development') {
  // https://github.com/zalmoxisus/redux-devtools-extension
  const devtoolsCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__; // eslint-disable-line no-underscore-dangle
  composeEnhancers = devtoolsCompose
    ? typeof devtoolsCompose === 'function'
      ? devtoolsCompose({ trace: true })
      : devtoolsCompose
    : compose;
}

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
  ),
);

sagaMiddleware.run(rootSaga);

export default store;
