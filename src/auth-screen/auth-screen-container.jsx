import React from "react";
import AppContext from "../app-context";
import { useHistory } from "react-router-dom";
import { SignupScreenRenderer } from "./auth-screen-renderer";
import { ErrorMessage } from "./auth-error-messages";

class AuthScreenContainer extends React.Component {
  firebase = global.firebase;

  state = {
    error: null
  };

  render() {
    const { error } = this.state;
    return (
      <SignupScreenRenderer
        onSignup={this._onSignup}
        onSignin={this._onSignin}
        error={error}
      />
    );
  }

  _onSignup = (email, password) => {
    const { authService } = this.props;
    if (email.length === 0 || password.length === 0) {
      return;
    }
    if (authService) {
      authService.signUp(
        email,
        password,
        this._goToHome,
        errorMessage => this.setState({ error: errorMessage })
      );
    }
  };

  _onSignin = (email, password) => {
    const { authService } = this.props;
    console.log(">>>> signdnfjsn", authService )
    if (authService) {

      authService.signIn(
        email,
        password,
        this._goToHome,
        () => this.setState({ error: ErrorMessage.InvalidLogin })
      );
    }
  }

  _goToHome = () => {
    const { history } = this.props;
    if (!history) {
      this.setState({ error: ErrorMessage.FatalError });
    }
    history.replace("/");
  }
}

export const AuthScreen = props => {
  const history = useHistory();
  return (
    <AppContext>
      {({ authService }) => <AuthScreenContainer {...props} authService={authService} history={history} />}
    </AppContext>
  );
};
