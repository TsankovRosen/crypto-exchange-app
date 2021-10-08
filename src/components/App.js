import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import DashboardPageContainer from "../pages/Dashboard/containers/DashboardPageContainer";

const App = () => (
  <Router>
    <Switch>
      <Route path="/:search?">
        <DashboardPageContainer />
      </Route>
    </Switch>
  </Router>
)

export default App;
