import React from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, StyleSheet, TouchableHighlight } from "react-native";

const GoalMode = {
  Everyday: "Everyday",
  WeekdayWeekEnd: "WeekdayWeekend",
  Custom: "Custom"
};

const Days = {
  "mon": "Monday",
  "tue": "Tuesday",
  "wed": "Wednesday",
  "thu": "Tuesday",
  "fri": "Friday",
  "sat": "Saturday",
  "sun": "Sunday"
};

const BlurContent = ({ blur, children }) => (
  <View style={{ opacity: blur ? 0.3 : 1 }}>
    {children}
  </View>
);

export default class Goal extends React.Component {
  state = {
    goalMode: null,
    everyday: null,
    weekdays: null,
    weekends: null,
    mon: null,
    tue: null,
    wed: null,
    thu: null,
    fri: null,
    sat: null,
    sun: null
  };

  render() {
    const { goalMode, weekdays, weekends, everyday } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => this.setState({ goalMode: null })}>
        <View style={styles.container}>
          <Text style={styles.titleText}>Goals</Text>
          <BlurContent blur={goalMode !== GoalMode.Everyday}>
            <TouchableWithoutFeedback onPress={() => this.setState({ goalMode: GoalMode.Everyday })}>
              <View style={styles.form}>
                <View style={styles.formLabel}>
                  <Text style={styles.text}>Everyday</Text>
                </View>
                <View style={styles.formInput}>
                  {this._renderTextInput(
                    everyday,
                    GoalMode.Everyday,
                    e => this._onSetValue(e, "everyday"),
                    true /* shouldAutoFocus */
                  )}
                </View>
                <TouchableHighlight
                  style={styles.clearButton}
                  onPress={() => this.setState({
                    goalMode: null,
                    everyday: null,
                    mon: null,
                    tue: null,
                    wed: null,
                    thu: null,
                    fri: null,
                    sat: null,
                    sun: null
                  })}
                >
                  <Text style={styles.text}>Clear</Text>
                </TouchableHighlight>
              </View>
            </TouchableWithoutFeedback>
          </BlurContent>

          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <Text>OR</Text>
          </View>

          <BlurContent blur={this.state.goalMode !== GoalMode.WeekdayWeekEnd}>
            <TouchableWithoutFeedback onPress={() => this.setState({ goalMode: GoalMode.WeekdayWeekEnd })}>
              <View>
                <View style={styles.form}>
                  <View style={styles.formLabel}>
                    <Text style={styles.text}>Weekdays</Text>
                  </View>
                  <View style={styles.formInput}>
                    {this._renderTextInput(
                      weekdays,
                      GoalMode.WeekdayWeekEnd,
                      e => this._onSetValue(e, "weekdays"),
                      true /* shouldAutoFocus */
                    )}
                  </View>
                  <TouchableHighlight
                    style={styles.clearButton}
                    onPress={() => this.setState({
                      goalMode: null,
                      weekdays: null,
                      mon: null,
                      tue: null,
                      wed: null,
                      thu: null,
                      fri: null
                    })}
                  >
                    <Text style={styles.text}>Clear</Text>
                  </TouchableHighlight>
                </View>
                <View style={styles.form}>
                  <View style={styles.formLabel}>
                    <Text style={styles.text}>Weekends</Text>
                  </View>
                  <View style={styles.formInput}>
                    {this._renderTextInput(
                      weekends,
                      GoalMode.WeekdayWeekEnd,
                      e => this._onSetValue(e, "weekends")
                    )}
                  </View>
                  <TouchableHighlight
                    style={styles.clearButton}
                    onPress={() => this.setState({
                      goalMode: null,
                      weekends: null,
                      sat: null,
                      sun: null
                    })}
                  >
                    <Text style={styles.text}>Clear</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </BlurContent>

          <View style={{ width: "100%", height: 1, borderBottom: "1px solid black", marginTop: 10 }} />

          <TouchableWithoutFeedback onPress={() => this.setState({ goalMode: GoalMode.Custom })}>
            <View>
              <View style={{ display: "flex", flexDirection: "row", marginVertical: 10, justifyContent: "center", position: "relative" }}>
                <Text style={styles.text}>Set Goals</Text>
                <TouchableHighlight
                  style={{ position: "absolute", right: 0, width: "20%" }}
                  onPress={() => this.setState({
                    goalMode: null,
                    mon: null,
                    tue: null,
                    wed: null,
                    thu: null,
                    fri: null,
                    sat: null,
                    sun: null
                  })}
                >
                  <Text style={styles.text}>Clear</Text>
                </TouchableHighlight>
              </View>
              <View>
              {this._renderDay("mon", true)}
              {this._renderDay("tue")}
              {this._renderDay("wed")}
              {this._renderDay("thu")}
              {this._renderDay("fri")}
              {this._renderDay("sat")}
              {this._renderDay("sun")}
              </View>
            </View>
          </TouchableWithoutFeedback>

          <TouchableHighlight style={{ marginVertical: 30 }}>
            <View style={{ backgroundColor: "rgb(209,63,87)", paddingVertical: 5 }}>
              <Text style={styles.text}>Save</Text>
            </View>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _renderDay = (day, autoFocusInput = false) => {
    return (
      <View style={styles.form}>
        <View style={styles.formLabel}>
          <Text style={styles.text}>{Days[day]}</Text>
        </View>
        <View style={styles.formInput}>
          {this._renderTextInput(
            this.state[day],
            GoalMode.Custom,
            e => this._onSetValue(e, day),
            autoFocusInput
          )}
        </View>
        <View style={styles.clearButton} />
      </View>
    )
  };

  _renderTextInput = (value, goalMode, onChange, shouldAutoFocus = false) => (
    goalMode === this.state.goalMode
      ? <TextInput value={value} style={styles.formTextInput} onChange={onChange} autoFocus={shouldAutoFocus} keyboardType={"numeric"} />
      : <Text style={styles.text}>{value !== null ? value : "Not set"}</Text>
  );

  _onSetValue = (event, formType) => {
    const value = event && event.target && event.target.value;
    if (!formType) {
      return;
    }
    const parsedValue = value.length === 0 || isNaN(parseInt(value)) ? null : parseInt(value);
    switch (formType) {
      case "everyday":
        this.setState({
          everyday: parsedValue,
          mon: parsedValue,
          tue: parsedValue,
          wed: parsedValue,
          thu: parsedValue,
          fri: parsedValue,
          sat: parsedValue,
          sun: parsedValue
        });
        break;
      case "weekdays":
        this.setState({
          weekdays: parsedValue,
          mon: parsedValue,
          tue: parsedValue,
          wed: parsedValue,
          thu: parsedValue,
          fri: parsedValue
        });
        break;
      case "weekends":
        this.setState({
          weekends: parsedValue,
          sat: parsedValue,
          sun: parsedValue
        });
        break;
      default:
        this.setState({ [formType]: parsedValue });
        break;
    }
  }

  _unsetAllWithOverride = override => this.setState({
    everyday: null,
    weekdays: null,
    weekends: null,
    ...override || {}
  });
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: 267,
    height: "100%",
    backgroundColor: "black",
    paddingVertical: 20
  },
  titleText: {
    color: "white",
    fontSize: 26,
    marginVertical: 10
  },
  form: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  formLabel: {
    width: "50%",
    textAlign: "left",
    paddingLeft: 10
  },
  formInput: {
    width: "30%",
    paddingRight: 10
  },
  clearButton: {
    width: "20%"
  },
  formTextInput: {
    color: "white",
    textAlign: "center",
    borderBottom: "1px solid black"
  },
  text: {
    color: "white"
  }
});
