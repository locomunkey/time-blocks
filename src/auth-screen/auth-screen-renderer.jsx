import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { ErrorMessage } from "./auth-error-messages";

export class SignupScreenRenderer extends React.Component {
  state = {
    isSignup: true,
    email: null,
    password: null,
    repeatPassword: null,
    errorMessage: ""
  };

  static getDerivedStateFromProps(props) {
    const { error } = props;
    if (error) {
      return { errorMessage: error };
    }
    return null;
  }

  render() {
    const { email, isSignup, errorMessage } = this.state;
    return (
      <View style={{ width: "100%", maxWidth: 267 }}>
        <Text style={styles.appTitle}>TimeBlocks</Text>
        <Text style={styles.subText}>
          {isSignup
            ? "Create a new account"
            : "Login to your account"
          }
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email address"
          value={email}
          onChange={this._onEmailChange}
          autoFocus
          keyboardType={"email-address"}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChange={this._onPasswordChange}
          autoCompleteType="password"
          secureTextEntry
        />
        {isSignup && (
          <TextInput
            style={styles.textInput}
            placeholder="Repeat password"
            onChange={this._onRepeatPasswordChange}
            autoCompleteType="password"
            secureTextEntry
          />
        )}
        <View style={{ height: 30 }}>
          <Text style={styles.errorMessage}>
            {errorMessage}
          </Text>
        </View>
        {this._renderButtons()}
      </View>
    );
  }

  _renderButtons = () => this.state.isSignup
    ? this._renderSignupButtons()
    : this._renderSigninButtons();

  _renderSignupButtons = () => (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={this._onSignup}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.subButton}
        onPress={() => this.setState({ isSignup: !this.state.isSignup })}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );

  _renderSigninButtons = () => (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={this._onSignin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.subButton}
        onPress={() => this.setState({ isSignup: !this.state.isSignup })}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );

  _onSignup = () => {
    const { onSignup } = this.props;
    const { email, password, repeatPassword } = this.state;
    if (!onSignup) {
      return this.setState({ errorMessage: ErrorMessage.Unexpected });
    }
    if (password !== repeatPassword) {
      return this.setState({ errorMessage: ErrorMessage.PasswordMismatch });
    }
    onSignup(email, password);
    this.setState({ errorMessage: "" });
  };

  _onSignin = () => {
    const { onSignin } = this.props;
    const { email, password } = this.state;
    if (!onSignin) {
      return this.setState({ errorMessage: ErrorMessage.Unexpected });
    }
    onSignin(email, password);
    this.setState({ errorMessage: "" });
  };

  _onEmailChange = e => {
    if (e && e.target && e.target.value) {
      this.setState({ email: e.target.value });
    }
    this.setState({ errorMessage: "" });
  };

  _onPasswordChange = e => {
    if (e && e.target && e.target.value) {
      this.setState({ password: e.target.value });
    }
    this.setState({ errorMessage: "" });
  };

  _onRepeatPasswordChange = e => {
    if (e && e.target) {
      this.setState({ repeatPassword: e.target.value });
    }
    this.setState({ errorMessage: "" });
  };
}

const styles = StyleSheet.create({
  appTitle: {
    color: "white",
    fontSize: 30,
    marginTop: 70,
    marginBottom: 30
  },
  buttonText: {
    color: "white"
  },
  subText: {
    color: "rgb(153, 153, 153)"
  },
  textInput: {
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    border: "1px solid rgb(38,38,38)"
  },
  button: {
    fontSize: 16,
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "rgb(209,63,87)"
  },
  subButton: {
    fontSize: 14,
    marginTop: 10,
    paddingVertical: 10
  },
  errorMessage: {
    color: "rgb(209,63,87)",
    marginTop: 10
  }
})
