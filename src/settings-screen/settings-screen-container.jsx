import React from "react";
import AppContext from "../app-context";
import { SettingsScreenRenderer } from "./settings-screen-renderer";

class SettingsScreenContainer extends React.Component {
  render = () => <SettingsScreenRenderer onSignOut={this._onSignOut} />;

  _onSignOut = () => {
    const { authService } = this.props;
    if (authService) {
      authService.signOut();
    }
  }
}

export const SettingsScreen = props => (
  <AppContext.Consumer>
    {({ authService }) => <SettingsScreenContainer {...props} authService={authService} />}
  </AppContext.Consumer>
);