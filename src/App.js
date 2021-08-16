import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { routes, routeList } from "./routes";

function App() {
  return (
    <Router>
      <Switch>
        {routeList.map((routeKey) => {
          const route = routes[routeKey];
          return (
            <Route key={route.path} exact={route.exact} path={route.path}>
              {route.component}
            </Route>
          );
        })}
      </Switch>
    </Router>
  );
}

export default App;
