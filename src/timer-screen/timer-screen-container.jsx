import React from "react";
import moment from "moment";
import TimerScreenRenderer from "./timer-screen-renderer";
import TimeBlocks from "../components/time-blocks";
import AppContext from "../app-context";

class TimerScreenContainer extends React.Component {
  state = {
    hours: 1,
    minutes: 0,
    seconds: 0,
    running: false,
    isDistracted: false,
    currentBlock: null,
    setHours: 1,
    setMinutes: 0,
    setSeconds: 0,
    earnedBlocks: [],
    goal: null,
    // Below not used
    dHours: 0,
    dMinutes: 0,
    dSeconds: 0,
    distractions: [],
    workdayStartTime: null,
    workdayEndTime: null
  };

  componentDidMount() {
    this._fetchBlocks();
    this._fetchGoals();
  }

  render() {
    const {
      running,
      currentBlock,
      earnedBlocks,
      goal
    } = this.state;
    return (
      <TimerScreenRenderer
        onTimerStart={this._startBlock}
        onTimerStop={() => this._endBlock(false /* completed */, true /* stopped */)}
        onTimerTick={this._onTimerTick}
        onTimerModify={this._onTimerModify}
        onTimerFinish={this._onTimerFinish}
        running={running}
        currentBlock={currentBlock}
        earnedBlocks={earnedBlocks}
        goal={goal}
      />
    );
  }

  _getNumHourlyBlocksBetweenTimes = (startTime, endTime) => moment.duration(moment(endTime).diff(startTime)).asHours();

  _fetchBlocks = async () => {
    const { remoteService } = this.props;
    const { todaysBlocks } = await remoteService.fetchBlocks();
    if (todaysBlocks) {
      this.setState({ earnedBlocks: todaysBlocks.filter(block => block.completed) });
    }
  };

  _fetchGoals = async () => {
    const { remoteService } = this.props;
    const goals = await remoteService.fetchGoals();
    if (goals && goals.length) {
      this.setState({ goal: goals[0] });
    }
  };

  _startBlock = () => {
    const { running, isDistracted, distractions } = this.state;
    if (!isDistracted) {
      this.setState({
        running: !running,
        distractions: !running ? [] : distractions,
        currentBlock: {
          hours: 1,
          minutes: 0,
          seconds: 0,
          createdAt: moment().toISOString(),
          startTime: moment().toISOString(),
          endTime: null,
          completed: false
        }
      });
    }
  };

  _endBlock = (completed = false, stopped = false) => {
    const {
      hours,
      minutes,
      seconds
      // setHours
      // setMinutes,
      // setSeconds
    } = this.state;
    this.setState({ running: false, isDistracted: false });
    this._logTimeBlock(
      hours,
      59 - minutes,
      59 - seconds,
      completed,
      stopped
    );
  };

  _onTimerTick = (hours, minutes, seconds) => this.setState({
    hours,
    minutes,
    seconds,
    currentBlock: {
      ...this.state.currentBlock,
      hours,
      minutes,
      seconds
    }
  });

  _onTimerModify = ({ hours, minutes, seconds }) => this.setState({
    hours,
    minutes,
    seconds,
    setHours: hours,
    setMinutes: minutes,
    setSeconds: seconds
  });

  _onTimerFinish = () => this._endBlock(true /* completed */, false /* stopped */);

  _renderEarnedBlocks = blocks => <TimeBlocks blocks={blocks} />;

  _logTimeBlock = (elapsedHours, elapsedMinutes, elapsedSeconds, completed = false, stopped=false) => {
    const { setHours, setMinutes, setSeconds, currentBlock, goal } = this.state;
    const { remoteService } = this.props;
    if (remoteService) {
      remoteService.addTimeBlock({
        ...currentBlock,
        hours: setHours,
        minutes: setMinutes,
        seconds: setSeconds,
        elapsedHours,
        elapsedMinutes,
        elapsedSeconds,
        goal,
        endTime: moment().toISOString(),
        distractions: this.state.distractions,
        completed,
        stopped
      });
    }
  };

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
  // _onStartTimeChange = workdayStartTime => this.setState({ workdayStartTime });
  // _onEndTimeChange = workdayEndTime => this.setState({ workdayEndTime });
}

export const TimerScreen = props => (
  <AppContext.Consumer>
    {({ remoteService }) => <TimerScreenContainer {...props} remoteService={remoteService} />}
  </AppContext.Consumer>
);
