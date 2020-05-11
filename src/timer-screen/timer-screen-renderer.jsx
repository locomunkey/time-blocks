import React from "react";
import moment from "moment";
import { View, Text, TouchableOpacity } from "react-native";
import Timer from "../components/timer";
import TimeBlocks from "../components/time-blocks";
import GoalUtils from "../utils/goal-utils";
import { Link } from "react-router-dom";

const isDistracted = false;

const blockDiff = block => {
  if (!block) {
    return { hours: 1, minutes: 0, seconds: 0 };
  }
  const startTime = moment(block.startTime);
  const duration = moment.duration(moment().diff(startTime));
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes()) - (hours * 60);
  const seconds = Math.floor(duration.asSeconds()) - (minutes * 60);
  return { hours, minutes: 59 - minutes, seconds: 59 - seconds };
};

const TimerScreenRenderer = ({
  onTimerTick,
  onTimerModify,
  onTimerFinish,
  onTimerStart,
  onTimerStop,
  running,
  earnedBlocks,
  currentBlock,
  goal
}) => {
  const { hours, minutes, seconds } = blockDiff(currentBlock);
  return (
    <View style={{ display: "flex", flexDirection: "column", maxWidth: 267, backgroundColor: "black", height: "100%", alignItems: "center", justifyContent: "center" }}>
      <View style={{ paddingHorizontal: 20, border: "1px solid rgb(38,38,38)", paddingBottom: 15, paddingTop: 5, minHeight: 177 }}>
        <Timer
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          running={running}
          paused={isDistracted}
          onTick={onTimerTick}
          onModify={onTimerModify}
          onFinish={onTimerFinish}
        />
        <Text style={{ color: "#999999", textAlign: "left", fontStyle: "oblique", fontSize: 13 }}>
          {"Focus on your task for 1 hour to earn "}
          <Text style={{ color: "white", fontStyle: "oblique" }}>{"1 block"}</Text>
          <Text style={{ fontWeight: "bold", color: "white", fontStyle: "normal" }}>{" ( "}</Text>
          <View style={{ height: 10, width: 10, backgroundColor: "rgb(97,196,85)" }} />
          <Text style={{ fontWeight: "bold", color: "white", fontStyle: "normal" }}>{" )"}</Text>
        </Text>

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
          <Text style={{ color: "#999999" }}>Today's Goal ( </Text>
          <Link to="/goals" style={{ marginBottom: 5 }}>
            <Text style={{ color: "rgb(209,63,87)",  }}>
              Set
            </Text>
          </Link>
          <Text style={{ color: "#999999" }}> )</Text>
        </View>

        <View style={{ display: "flex", height: 50, justifyContent: "center", alignItems: "center" }}>
          {
            (running || isDistracted) || (GoalUtils.getTodaysBlockGoal(goal) !== 0)
              ? (
                <TimeBlocks
                  earnedBlocks={earnedBlocks}
                  currentBlock={currentBlock}
                  goal={goal}
                />
              ) : (
                <View style={{ width: "100%", justifyContent: "center" }}>
                  <Text style={{ color: "#999999" }}>No goal</Text>
                </View>
              )
          }
        </View>
      </View>
      <View style={{ marginVertical: 40 }}>
        <TouchableOpacity
          style={{ 
            backgroundColor: running || isDistracted
              ? "rgb(28,35,54)"
              : "rgb(209,63,87)",
            borderRadius: 80,
            width: 80,
            height: 80,
            display: "flex",
            justifyContent: "center",
            shadowColor: 'rgba(0,0,0, .4)',
            shadowOffset: { height: 1, width: 1 },
            shadowOpacity: 1,
            shadowRadius: 1,
            elevation: 2
          }}
          onPress={running || isDistracted ? onTimerStop : onTimerStart}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 2, color: "white" }}>
            {running || isDistracted ? "Give up" : "Start"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimerScreenRenderer;

// _renderDistractionTimer = () => (
//   <Timer
//     hours={0}
//     minutes={0}
//     seconds={0}
//     isCountUp
//     small
//     onTick={(dHours, dMinutes, dSeconds) => this.setState({ dHours, dMinutes, dSeconds })}
//     running={isDistracted}
//     onFinish={this._onDistractionFinish}
//   />
// );
// _renderDistractions = () => (
//   <div style={{ fontSize: 16 }}>
//     <p style={{ fontSize: 22 }}>Distractions</p>
//     {this.state.distractions.length === 0 && <p>No distractions</p>}
//     {this.state.distractions.map(({ elapsedHours, elapsedMinutes, elapsedSeconds, createdAt }) => (
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <p>At {moment(createdAt).format('hh:mm:ss')}</p>
//         <p>{elapsedHours} : {elapsedMinutes} : {elapsedSeconds}</p>
//       </div>
//     ))}
//   </div>
// );
// _onLogDistraction = () => this.setState({
//   distractions: [
//     {
//       createdAt: moment().toISOString(),
//       hours: this.state.hours,
//       minutes: this.state.minutes,
//       seconds: this.state.seconds,
//       elapsedHours: 0,
//       elapsedMinutes: 0,
//       elapsedSeconds: 0
//     },
//     ...this.state.distractions
//   ]
// });
// _onDistractionStart = () => this.setState({ running: false, isDistracted: true });
// _onDistractionFinish = () => {
//   const { dHours, dMinutes, dSeconds } = this.state;
//   this._logDistraction(dHours, dMinutes, dSeconds);
//   this._resetDistraction();
//   this.setState({ running: true });
// };
// _resetDistraction = () => this.setState({ dHours: 0, dMinutes: 0, dSeconds: 0, isDistracted: false });
// _logDistraction = (hours, minutes, seconds) => {
//   const { distractions } = this.state;
//   const newDistraction = {
//     createdAt: moment().toISOString(),
//     hours,
//     minutes,
//     seconds,
//     elapsedHours: hours,
//     elapsedMinutes: minutes,
//     elapsedSeconds: seconds
//   };
//   this.setState({ distractions: [newDistraction, ...distractions] });
// };
