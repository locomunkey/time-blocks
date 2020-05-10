import React from "react";
import AppContext from "../app-context";
import { GoalsScreenRenderer } from "./goals-renderer";

class GoalsScreenContainer extends React.Component {
  state = {
    goals: [],
    id: null,
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

  componentDidMount() {
    this._fetchGoals();
  }

  render = () => {
    const {
      goalMode,
      everyday,
      weekdays,
      weekends,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun
    } = this.state;
    return (
      <GoalsScreenRenderer
        goalMode={goalMode}
        goal={{
          everyday,
          weekdays,
          weekends,
          mon,
          tue,
          wed,
          thu,
          fri,
          sat,
          sun
        }}
        onChangeGoal={this._onChangeGoal}
        onChangeGoalMode={this._onChangeGoalMode}
        onSaveGoal={this._onSaveGoal}
      />
    );
  }

  _getCurrentGoal = () => ({
    id: this.state.id,
    everyday: this.state.everyday,
    weekdays: this.state.weekdays,
    weekends: this.state.weekends,
    mon: this.state.mon,
    tue: this.state.tue,
    wed: this.state.wed,
    thu: this.state.thu,
    fri: this.state.fri,
    sat: this.state.sat,
    sun: this.state.sun
  });

  _onSaveGoal = () => {
    const { remoteService } = this.props;
    if (remoteService) {
      if (this.state.id) {
        remoteService.updateGoal(this._getCurrentGoal());
      } else {
        remoteService.addGoal(this._getCurrentGoal());
      }
    }
  }

  _fetchGoals = async () => {
    const { remoteService } = this.props;
    if (remoteService) {
      const goals = await remoteService.fetchGoals();
      if (goals && goals.length > 0) {
        console.log(">>>", goals[0])
        this.setState({ goals, ...goals[0] });
      }
    }
  }

  _onChangeGoalMode = goalMode => this.setState({ goalMode });

  _onChangeGoal = goal => this.setState({ ...goal });
}

export const GoalsScreen = props => (
  <AppContext.Consumer>
    {({ remoteService }) => <GoalsScreenContainer {...props} remoteService={remoteService} />}
  </AppContext.Consumer>
);
