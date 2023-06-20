import "./App.css";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";

import Auth from "./pages/Auth";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/auth" component={Auth} exact />
        <Route path="/forgotpassword" component={ForgotPassword} exact />
        <Route path="/resetpassword" component={ResetPassword} exact />
        
        {/* <Route path="/chats" component={Chats} exact /> */}
      </Switch>
    </div>
  );
}

export default App;
