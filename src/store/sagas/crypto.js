import { eventChannel } from 'redux-saga';
import { gunzip, strFromU8 } from 'fflate';
import axios from 'axios';
import { takeEvery, debounce, call, put, take, all } from 'redux-saga/effects';
import {setCrypto, SUBMIT_CRYPTO_SEARCH} from '../actions/crypto';

const WS_BIT_FINEX_PATH = 'wss://api-pub.bitfinex.com/ws/2';
const WS_BINANCE = 'wss://stream.binance.com:9443';
const WS_HUOBI = 'wss://api.huobi.pro/ws';
const KRAKEN_API = 'https://api.kraken.com/0/public/Ticker';

function* watchCryptoSearch() {
  yield debounce(500, SUBMIT_CRYPTO_SEARCH, websocketSagas);
}

function* websocketSagas({ payload }) {
  yield all([
    call(runChannel, { payload, handler: handleHuobi }),
    call(runChannel, { payload, handler: handleBinance }),
    call(runChannel, { payload, handler: handleBitFinex }),
  ]);
}

function* runChannel({ payload, handler }) {
  const channel = yield call(handler, payload);

  yield takeEvery(SUBMIT_CRYPTO_SEARCH, () => {
    channel.close();
  });

  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function handleBitFinex(payload) {
  const domain = 'BitFinex';
  const [symbol, currency] = payload;

  return eventChannel((emitter) => {
    const ws = new WebSocket(WS_BIT_FINEX_PATH);
    const onOpen = () => {
      const msg = JSON.stringify({
        event: 'subscribe',
        channel: 'ticker',
        symbol: `t${symbol}${currency}`
      });

      return ws.send(msg);
    };

    const onMessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        const hb = message[1];

        if (hb && hb !== 'hb') {
          const price = hb[6];

          return emitter(
            setCrypto({ domain, symbol, currency, price })
          );
        }
      } catch(e) {
        console.error(`Error parsing: ${e}`)
      }
    };

    ws.onopen = onOpen;
    ws.onmessage = onMessage;

    return () => {
      const msg = JSON.stringify({
        event: 'unsubscribe',
        channel: 'ticker',
        symbol: `t${symbol}${currency}`
      });

      ws.send(msg);
      ws.close();
    };
  });
}

function handleHuobi(payload) {
  const [symbol, currency] = payload;

  return eventChannel((emitter) => {
    const domain = 'Huobi';
    const ws = new WebSocket(WS_HUOBI);
    const topic = `market.${symbol.toLowerCase()}${currency.toLowerCase()}t.ticker`;

    const onOpen = () => {
      const msg = JSON.stringify({
        sub: topic,
        id: 'id1'
      });

      ws.send(msg);
    };

    const onMessage = async (e) => {
      try {
        const fr = new FileReader();

        fr.onload = () => {
          gunzip(
            new Uint8Array(fr.result),
            (err, raw) => {
              if (err) {
                // TODO
                console.error(err);
                return;
              }

              const data = JSON.parse(strFromU8(raw));

              if (data.ping) {
                ws.send(JSON.stringify({ pong: Date.now() }));
              } else {
                return emitter(
                  setCrypto({
                    domain,
                    symbol,
                    currency,
                    price: data.tick?.lastPrice,
                    details: data.tick
                  })
                );
              }
            }
          );
        }

        fr.readAsArrayBuffer(e.data);
      } catch(e) {
        console.error(`Error parsing: ${e}`)
      }
    };

    ws.onopen = onOpen;
    ws.onmessage = onMessage;

    return () => {
      ws.send(
        JSON.stringify({ unsub: topic })
      );
      ws.close();
    };
  })
}

function handleBinance(payload) {
  const domain = 'Binance';
  const [symbol, currency] = payload;
  const topic = `${symbol.toLowerCase()}${currency.toLowerCase()}t`;
  const ws = new WebSocket(`${WS_BINANCE}/ws/${topic}`);

  return eventChannel((emitter) => {
    const onOpen = (e) => {
      console.log(e);
      const msg = JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`${topic}@ticker`],
        id: 1
      });

      ws.send(msg);
    };

    const onMessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        const price = message.c;
        console.log(message);

        if (price) {
          return emitter(
            setCrypto({ domain, symbol, currency, price })
          );
        }
      } catch (e) {
        console.error(`Error parsing: ${e}`)
      }
    };

    ws.onopen = onOpen;
    ws.onmessage = onMessage;

    return () => {
      const msg = JSON.stringify({
        method: 'UNSUBSCRIBE',
        params: [`${topic}@ticker`],
        id: 1
      });

      ws.send(msg);
      ws.close();
    };
  });
}

function handleKraken(payload) {
  const [symbol, currency] = payload;
  return eventChannel((emitter) => {
    const callKraken = async () => {
      try {
        const { data } = await axios({
          method: 'GET',
          url: KRAKEN_API,
          params: {
            pair: `${symbol}${currency}`
          }
        });

        console.log(data.result);
      } catch (e) {
        console.log(e);
      }
    }

    callKraken();

    // const interval = setInterval(callKraken, 10000);

    return () => {
      // clearInterval(interval);
    }
  });
}

export default [
  watchCryptoSearch
]
