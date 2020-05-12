import React from "react";
import moment from "moment";
import { View, Text } from "react-native";
import AppContext from "../app-context";
import { LogScreenRenderer } from "./log-screen-renderer";

class LogScreenContainer extends React.Component {
  state = {
    startedBlocks: [],
    earnedBlocks: [],
    goal: null
  };

  async componentDidMount() {
    this._fetchBlocks();
    this._fetchGoal();
  }

  render() {
    const { startedBlocks, earnedBlocks, goal } = this.state;
    return (
      <View style={{ width: "100%" }}>
        <Text style={{ color: "rgb(204, 204, 204)", fontSize: 30, textAlign: "center", marginVertical: 15, marginHorizontal: 40, fontWeight: "bold" }}>
          Log
        </Text>
        <LogScreenRenderer
          days={this._getDays([...startedBlocks, ...earnedBlocks])}
          goal={goal}
        />
      </View>
    );
  }

  _fetchBlocks = async () => {
    const { remoteService } = this.props;
    if (remoteService) {
      const { startedBlocks, earnedBlocks } = await remoteService.fetchBlocks();
      this.setState({ startedBlocks, earnedBlocks });
    }
  }

  _fetchGoal = async () => {
    const { remoteService } = this.props;
    const goals = await remoteService.fetchGoals();
    if (goals && goals.length > 0) {
      this.setState({ goal: goals[0] });
    }
  };

  _getDays = blocks => {
    const days = {};
    let startDate = null;
    let endDate = null;

    for (const block of blocks) {
      if (!block.startTime) {
        continue;
      }
      const dayMoment = moment(block.startTime);
      const dayKey = dayMoment.format("DD MM YYYY");
      const day = days[dayKey];

      // Group blocks by day
      if (day) {
        day.blocks.push(block);
      } else {
        days[dayKey] = { date: block.startTime, blocks: [block] };
      }

      // Set lowest and highest days
      if (!startDate) {
        startDate = block.startTime;
      }
      if (!endDate) {
        endDate = block.startTime;
      }
      if (dayMoment.isBefore(moment(startDate))) {
        startDate = block.startTime;
      }
      if (dayMoment.isAfter(moment(startDate))) {
        endDate = block.startTime;
      }
    }

    const sortedDates = Object.keys(days).sort((a,b) => moment(a, "DD MM YYY") - moment(b, "DD MM YYYY"));
    return sortedDates.map(date => days[date]);
  }

  _getContiguousDays = (startDate, endDate) => {
    const dayList = [];
    let currentDay = moment(startDate);
    while (currentDay.format("DD MM YYYY") !== moment(endDate).format("DD MM YYYY")) {
      dayList.push(currentDay.format("DD MM YYYY"));
      currentDay = currentDay.add(1, "days");
    }
    return dayList;
  }
}

export const LogScreen = props => (
  <AppContext.Consumer>
    {({ remoteService }) => <LogScreenContainer {...props} remoteService={remoteService} />}
  </AppContext.Consumer>
)
