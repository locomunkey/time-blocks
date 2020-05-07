import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableHighlight
} from "react-native";

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


export class GoalsScreenRenderer extends React.Component {
  render() {
    const { goalMode, goal, onChangeGoalMode, onSaveGoal } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => onChangeGoalMode(null)}>
        <View style={{ width: "100%" }}>
          <Text style={{ color: "rgb(204, 204, 204)", fontSize: 30, textAlign: "center", marginVertical: 15, marginHorizontal: 40, fontWeight: "bold" }}>
            Log
          </Text>
          <View style={{ paddingTop: 10, width: "100%", display: "flex", alignItems: "center", marginHorizontal: 5 }}>
            <View style={{ maxWidth: 267, height: "100%", width: "100%" }}>
              <BlurContent blur={goalMode !== GoalMode.Everyday}>
                <TouchableWithoutFeedback onPress={() => this._onClickSection(GoalMode.Everyday)}>
                  <View style={styles.form}>
                    <View style={styles.formLabel}>
                      <Text style={styles.text}>Everyday</Text>
                    </View>
                    <View style={styles.formInput}>
                      {this._renderTextInput(
                        goal.everyday,
                        GoalMode.Everyday,
                        e => this._onSetValue(e, "everyday"),
                        true /* shouldAutoFocus */
                      )}
                    </View>
                    <TouchableHighlight
                      style={styles.clearButton}
                      onPress={this._onClearEveryday}
                    >
                      <Text style={styles.text}>Clear</Text>
                    </TouchableHighlight>
                  </View>
                </TouchableWithoutFeedback>
              </BlurContent>

              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <Text>OR</Text>
              </View>

              <BlurContent blur={goalMode !== GoalMode.WeekdayWeekEnd}>
                <TouchableWithoutFeedback onPress={() => this._onClickSection(GoalMode.WeekdayWeekEnd)}>
                  <View>
                    <View style={styles.form}>
                      <View style={styles.formLabel}>
                        <Text style={styles.text}>Weekdays</Text>
                      </View>
                      <View style={styles.formInput}>
                        {this._renderTextInput(
                          goal.weekdays,
                          GoalMode.WeekdayWeekEnd,
                          e => this._onSetValue(e, "weekdays"),
                          true /* shouldAutoFocus */
                        )}
                      </View>
                      <TouchableHighlight
                        style={styles.clearButton}
                        onPress={this._onClearWeekdays}
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
                          goal.weekends,
                          GoalMode.WeekdayWeekEnd,
                          e => this._onSetValue(e, "weekends")
                        )}
                      </View>
                      <TouchableHighlight
                        style={styles.clearButton}
                        onPress={this._onClearWeekends}
                      >
                        <Text style={styles.text}>Clear</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </BlurContent>

              <View style={{ width: "100%", height: 1, borderBottom: "1px solid black", marginTop: 10 }} />

              <TouchableWithoutFeedback onPress={() => this._onClickSection(GoalMode.Custom)}>
                <View>
                  <View style={{ display: "flex", flexDirection: "row", marginVertical: 10, justifyContent: "center", position: "relative" }}>
                    <Text style={styles.text}>Set Goals</Text>
                    <TouchableHighlight
                      style={{ position: "absolute", right: 0, width: "20%" }}
                      onPress={this._onClearCustom}
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

              <TouchableHighlight style={{ marginVertical: 30 }} onPress={onSaveGoal}>
                <View style={{ backgroundColor: "rgb(209,63,87)", paddingVertical: 5 }}>
                  <Text style={styles.text}>Save</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _onClearEveryday = () => {
    const { onChangeGoal, onChangeGoalMode }  = this.props;
    if (!onChangeGoal || !onChangeGoalMode) {
      console.log("Log _onClearEveryday: Props onChangeGoal and onChangeGoalMode are required");
      return;
    }
    onChangeGoalMode(null);
    onChangeGoal({
      everyday: null,
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
      sun: null
    });
  }

  _onClearWeekdays = () => {
    const { onChangeGoal, onChangeGoalMode }  = this.props;
    if (!onChangeGoal || !onChangeGoalMode) {
      console.log("Log _onClearWeekdays: Props onChangeGoal and onChangeGoalMode are required");
      return;
    }
    onChangeGoalMode(null);
    onChangeGoal({
      weekdays: null,
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null
    });
  }

  _onClearWeekends = () => {
    const { onChangeGoal, onChangeGoalMode }  = this.props;
    if (!onChangeGoal || !onChangeGoalMode) {
      console.log("Log _onClearWeekends: Props onChangeGoal and onChangeGoalMode are required");
      return;
    }
    onChangeGoalMode(null);
    onChangeGoal({
      weekends: null,
      sat: null,
      sun: null
    });
  }

  _onClickSection = goalMode => {
    const { onChangeGoalMode } = this.props;
    if (!onChangeGoalMode) {
      return;
    }
    onChangeGoalMode(goalMode);
  }

  _onClearCustom = () => {
    const { onChangeGoal, onChangeGoalMode }  = this.props;
    if (!onChangeGoal || !onChangeGoalMode) {
      console.log("Log _onClearCustom: Props onChangeGoal and onChangeGoalMode are required");
      return;
    }
    onChangeGoal({
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
      sun: null
    });
    onChangeGoalMode(null);
  }

  _renderDay = (day, autoFocusInput = false) => {
    const { goal } = this.props;
    return (
      <View style={styles.form}>
        <View style={styles.formLabel}>
          <Text style={styles.text}>{Days[day]}</Text>
        </View>
        <View style={styles.formInput}>
          {this._renderTextInput(
            goal[day],
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
    goalMode === this.props.goalMode
      ? <TextInput value={value} style={styles.formTextInput} onChange={onChange} autoFocus={shouldAutoFocus} keyboardType={"numeric"} />
      : <Text style={styles.text}>{value !== null ? value : "Not set"}</Text>
  );

  _onSetValue = (event, formType) => {
    const { onChangeGoal } = this.props;
    if (!onChangeGoal) {
      return;
    }
    const value = event && event.target && event.target.value;
    if (!formType) {
      return;
    }
    const parsedValue = value.length === 0 || isNaN(parseInt(value)) ? null : parseInt(value);
    switch (formType) {
      case "everyday":
        onChangeGoal({
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
        onChangeGoal({
          weekdays: parsedValue,
          mon: parsedValue,
          tue: parsedValue,
          wed: parsedValue,
          thu: parsedValue,
          fri: parsedValue
        });
        break;
      case "weekends":
        onChangeGoal({
          weekends: parsedValue,
          sat: parsedValue,
          sun: parsedValue
        });
        break;
      default:
        onChangeGoal({ [formType]: parsedValue });
        break;
    }
  }

  _unsetAllWithOverride = override => this.props.onChangeGoal && this.props.onChangeGoal({
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

// return (
//   <TouchableWithoutFeedback onPress={() => onChangeGoalMode(null)}>
//     <View style={styles.container}>
//       <Text style={styles.titleText}>Goals</Text>
//       <BlurContent blur={goalMode !== GoalMode.Everyday}>
//         <TouchableWithoutFeedback onPress={() => this._onClickSection(GoalMode.Everyday)}>
//           <View style={styles.form}>
//             <View style={styles.formLabel}>
//               <Text style={styles.text}>Everyday</Text>
//             </View>
//             <View style={styles.formInput}>
//               {this._renderTextInput(
//                 goal.everyday,
//                 GoalMode.Everyday,
//                 e => this._onSetValue(e, "everyday"),
//                 true /* shouldAutoFocus */
//               )}
//             </View>
//             <TouchableHighlight
//               style={styles.clearButton}
//               onPress={this._onClearEveryday}
//             >
//               <Text style={styles.text}>Clear</Text>
//             </TouchableHighlight>
//           </View>
//         </TouchableWithoutFeedback>
//       </BlurContent>

//       <View style={{ marginTop: 10, marginBottom: 10 }}>
//         <Text>OR</Text>
//       </View>

//       <BlurContent blur={goalMode !== GoalMode.WeekdayWeekEnd}>
//         <TouchableWithoutFeedback onPress={() => this._onClickSection(GoalMode.WeekdayWeekEnd)}>
//           <View>
//             <View style={styles.form}>
//               <View style={styles.formLabel}>
//                 <Text style={styles.text}>Weekdays</Text>
//               </View>
//               <View style={styles.formInput}>
//                 {this._renderTextInput(
//                   goal.weekdays,
//                   GoalMode.WeekdayWeekEnd,
//                   e => this._onSetValue(e, "weekdays"),
//                   true /* shouldAutoFocus */
//                 )}
//               </View>
//               <TouchableHighlight
//                 style={styles.clearButton}
//                 onPress={this._onClearWeekdays}
//               >
//                 <Text style={styles.text}>Clear</Text>
//               </TouchableHighlight>
//             </View>
//             <View style={styles.form}>
//               <View style={styles.formLabel}>
//                 <Text style={styles.text}>Weekends</Text>
//               </View>
//               <View style={styles.formInput}>
//                 {this._renderTextInput(
//                   goal.weekends,
//                   GoalMode.WeekdayWeekEnd,
//                   e => this._onSetValue(e, "weekends")
//                 )}
//               </View>
//               <TouchableHighlight
//                 style={styles.clearButton}
//                 onPress={this._onClearWeekends}
//               >
//                 <Text style={styles.text}>Clear</Text>
//               </TouchableHighlight>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </BlurContent>

//       <View style={{ width: "100%", height: 1, borderBottom: "1px solid black", marginTop: 10 }} />

//       <TouchableWithoutFeedback onPress={() => this._onClickSection(GoalMode.Custom)}>
//         <View>
//           <View style={{ display: "flex", flexDirection: "row", marginVertical: 10, justifyContent: "center", position: "relative" }}>
//             <Text style={styles.text}>Set Goals</Text>
//             <TouchableHighlight
//               style={{ position: "absolute", right: 0, width: "20%" }}
//               onPress={this._onClearCustom}
//             >
//               <Text style={styles.text}>Clear</Text>
//             </TouchableHighlight>
//           </View>
//           <View>
//           {this._renderDay("mon", true)}
//           {this._renderDay("tue")}
//           {this._renderDay("wed")}
//           {this._renderDay("thu")}
//           {this._renderDay("fri")}
//           {this._renderDay("sat")}
//           {this._renderDay("sun")}
//           </View>
//         </View>
//       </TouchableWithoutFeedback>

//       <TouchableHighlight style={{ marginVertical: 30 }} onPress={onSaveGoal}>
//         <View style={{ backgroundColor: "rgb(209,63,87)", paddingVertical: 5 }}>
//           <Text style={styles.text}>Save</Text>
//         </View>
//       </TouchableHighlight>
//     </View>
//   </TouchableWithoutFeedback>
// )
