import React, {useMemo, useState} from 'react';
import { useParams } from 'react-router-dom';
import SearchInput from '../../components/SearchInput/SearchInput';

const validationRegExp = new RegExp('^[A-Z]{2,4}\\/[A-Z]{2,4}$');

const DashboardPage = ({ handleSearch, data, isLoading }) => {
  const [error, setError] = useState();
  const { search } = useParams();
  const crypto = useMemo(() => {
    const domains = Object.keys(data);
    if (!domains.length) {
      return [];
    }

    return domains.map((domain) => ({
        domain,
        ...data[domain]
    }));
  }, [data]);

  const handleOnChange = (value) => {
    console.log(value);

    if (validationRegExp.test(value)) {
      handleSearch(value.split('/'));
      setError(undefined);
    } else{
      setError('Invalid Input')
    }
  };

  return (
    <div className="layout">
      <header>Layout</header>
      <section className="main">
        <SearchInput
          label={'Enter Crypto currency/currency pair for example: "BTC/USD", "BTC/USDT", "ETH/USD"'}
          onChange={handleOnChange}
          initialValue={search ? decodeURIComponent(search) : ''}
          error={error}
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {crypto.map((row) => (
              <li key={row.domain}>
                <span className="domain">{row.domain}:</span>
                <span className="symbol">1 {row.symbol} = </span>
                <span className="price">${row.price}</span>
                <span className="currency">{row.currency}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
