import { connect } from 'react-redux';
import DashboardPage from '../DashboardPage';
import { submitCryptoSearch } from '../../../store/actions/crypto';

const DashboardPageContainer = connect(
  (state) => ({
    data: state.crypto.list,
    isLoading: state.crypto.isLoading
  }),
  {
    handleSearch: submitCryptoSearch
  }
)(DashboardPage)

export default DashboardPageContainer
