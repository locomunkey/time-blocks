import React from "react";
import moment from "moment";
import { Text, View, TouchableOpacity } from "react-native";

const generateTimeBlockKey = () => moment().format("DD/MM/YYYY");

// Goal ID - DQn6m7VHOVe4TtcwlgCk

function logTimeBlock (firebase, block) {
  // if (!localStorage) {
  //   return null;
  // }
  // const key = generateTimeBlockKey();
  // const existingBlocksStr = localStorage.getItem(key);
  // const existingBlocks = existingBlocksStr ? JSON.parse(existingBlocksStr) : [];

  // localStorage.setItem(
  //   key,
  //   JSON.stringify([block, ...existingBlocks])
  // );
  firebase.firestore().collection("blocks").add(block);
}

function countDownOneSecond (hours, minutes, seconds) {
  if (seconds === 0) {
    if (minutes === 0) {
      if (hours === 0) {
        // Count down finished
        return null;
      }
      return {
        hours: hours - 1,
        minutes: 59,
        seconds: 59
      };
    }
    return {
      hours,
      minutes: minutes - 1,
      seconds: 59
    };
  }

  return {
    hours,
    minutes,
    seconds: seconds - 1
  };
}

function countUpOneSecond (hours, minutes, seconds) {
  if (seconds === 59) {
    if (minutes === 59) {
      if (hours === 59) {
        // Counter finished
        return null;
      }
      return {
        hours: hours + 1,
        minutes: 0,
        seconds: 0
      };
    }
    return {
      hours,
      minutes: minutes + 1,
      seconds: 0
    };
  }

  return {
    hours,
    minutes,
    seconds: seconds + 1
  };
}

/**
 * States:
 * 1. Idle
 * 2. Running
 * @param {*} param0 
 */
class Timer extends React.Component {
  intervalTimer = null;

  constructor(props) {
    super(props);
    const { hours, minutes, seconds } = props;
    this.state = {
      hours,
      minutes,
      seconds,
      running: false
    };
  }

  componentDidMount = () => {
    if (!this.intervalTimer) {
      this.intervalTimer = setInterval(this._onIntervalFire, 1000);
    }
  };

  componentWillUnmount = () => clearInterval(this.intervalTimer);

  static getDerivedStateFromProps = ({ hours, minutes, seconds, running, paused }) => {
    if (!running && !paused) {
      return {
        hours,
        minutes,
        seconds,
        running
      };
    }
    return { running };
  };

  pad(n, z) {
    z = z || '0';
    n = n + '';
    return n.length >= 2 ? n : new Array(2 - n.length + 1).join(z) + n;
  }

  render() {
    const { hours, minutes, seconds } = this.state;
    const commonStyles = {
      color: "#ccc"
    };
    return (
      <div style={{ marginTop: 20, marginBottom: 10 }}>
        <span style={this.props.small ? { fontSize: 20, ...commonStyles } : { fontSize: 40, ...commonStyles }}>
          {this.pad(hours)} : {this.pad(minutes)} : {this.pad(seconds)}
        </span>
      </div>
    );
  }

  _onIntervalFire = () => {
    const { hours, minutes, seconds, running } = this.state;
    const { onFinish, isCountUp, onTick } = this.props;
    if (!running) {
      return;
    }

    const result = isCountUp
      ? countUpOneSecond(hours, minutes, seconds)
      : countDownOneSecond(hours, minutes, seconds);
    if (!result) {
      this.setState({ running: false });
      onFinish && onFinish();
    }

    this.setState({
      hours: result.hours,
      minutes: result.minutes,
      seconds: result.seconds
    }, () => {
      const { hours, minutes, seconds } = this.state;
      onTick && onTick(hours, minutes, seconds);
    });
  }
};

class TimeField extends React.Component {
  constructor(props) {
    super(props);
    const { start, end, hourDifference } = props;
    const startTime = start || moment();
    const endTime = end || moment(startTime).add(hourDifference || 6, "hours");
    this.state = {
      editMode: false,
      startTime,
      endTime
    };
    this.containerRef = React.createRef();
    this.inputRef = React.createRef();
  }

  componentDidMount = () => document.addEventListener("mouseup", this._toggleEditMode);

  componentWillUnmount = () => document.removeEventListener("mouseup", this._toggleEditMode);

  static getDerivedStateFromProps(props, state) {
    const { startTime, endTime } = props;
    return {
      startTime: startTime || state.startTime,
      endTime: endTime || state.endTime
    };
  }

  render() {
    const { startTime, endTime } = this.state;
    return (
      <div ref={this.containerRef} onClick={this._toggleEditMode} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex" }}>
          {this._renderHour(startTime.format("hh"), true)} : {this._renderMinute(startTime.format("mm"), true)} {this._renderAmPm(startTime.format("a"))}
        </div>
        -
        <div style={{ display: "flex" }}>
          {this._renderHour(endTime.format("hh"))} : {this._renderMinute(endTime.format("mm"))} {this._renderAmPm(endTime.format("a"))}
        </div>
      </div>
    );
  }

  _renderHour(text, isStartTime=false) {
    const { editMode } = this.state;
    if (editMode) {
      return this._renderInput(text, e => this._onHourChange(e, isStartTime));
    } else {
      return <p style={{ margin: 0 }}>{text}</p>;
    }
  }

  _renderMinute(text, isStartTime=false) {
    const { editMode } = this.state;
    if (editMode) {
      return this._renderInput(text, e => this._onMinuteChange(e, isStartTime));
    } else {
      return <p style={{ margin: 0 }}>{text}</p>;
    }
  }

  _renderInput = (value, onChange) => <input ref={this.inputRef} type="text" style={{ width: 30 }} value={value} onChange={onChange} />;

  _renderAmPm() {
    return (
      <select>
        <option selected value="am">AM</option>
        <option value="pm">PM</option>
      </select>
    );
  }

  _toggleEditMode = e => {
    // Outside click
    if (this.containerRef && !this.containerRef.current.contains(e.target)) {
      return this.setState({ editMode: false });
    } else {
      this.setState({ editMode: true });
    }
  }

  _onHourChange = (e, isStartTime) => {
    const { onStartChange, onEndChange } = this.props;
    const { minute } = this.state;
    const hour = e.target.value;
    if (isStartTime) {
      onStartChange({ hour, minute });
    } else {
      onEndChange({ hour, minute });
    }
  }

  _onMinuteChange = (e, isStartTime) => {
    const { onStartChange, onEndChange } = this.props;
    const { hour } = this.state;
    const minute = e.target.value;
    if (isStartTime) {
      onStartChange({ hour, minute });
    } else {
      onEndChange({ hour, minute });
    }
  }
}

const TimeBlocks = ({ blocks }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {blocks.map(block => (
          <div style={{ width: 13, height: 13, marginRight: 2, marginTop: 2, backgroundColor: block.completed ? "rgb(97,196,85)" : "gray", borderRadius: 0 }} />
        ))}
      </div>
    </div>
  );
};

const BlockProgress = ({ progressPercent, marks }) => (
  <div style={{ position: "relative", width: "100%", height: 10, backgroundColor: "gray", borderRadius: 0, overflow: "hidden" }}>
    <div style={{ width: `${progressPercent > 0 && progressPercent < 3 ? 30 : progressPercent}%`, backgroundColor: "rgb(84,63,133)", height: "100%" }} />
    {marks && marks.map(mark => (
      <div style={{ position: "absolute", left: `${mark}%`, height: "100%", width: 2, top: 0, backgroundColor: "red" }} />  
    ))}
  </div>
);

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export default class Home extends React.Component {
  firebase = global.firebase;

  state = {
    hours: 1,
    minutes: 0,
    seconds: 0,
    running: false,
    isDistracted: false,
    currentBlock: null,
    dHours: 0,
    dMinutes: 0,
    dSeconds: 0,
    distractions: [],
    workdayStartTime: null,
    workdayEndTime: null,
    setHours: 1,
    setMinutes: 0,
    setSeconds: 0,
    earnedBlocks: []
  };

  componentDidMount() {
    var firebaseConfig = {
      apiKey: "AIzaSyCBZrwH6IoMDo-jW2Ydu00z0FJMK3wQdTI",
      authDomain: "timeblocks-bb1cc.firebaseapp.com",
      databaseURL: "https://timeblocks-bb1cc.firebaseio.com",
      projectId: "timeblocks-bb1cc",
      storageBucket: "timeblocks-bb1cc.appspot.com",
      messagingSenderId: "689367456633",
      appId: "1:689367456633:web:6cb0b27d54e4c45f9bada8",
      measurementId: "G-92KBT48GWG"
    };
    const dateFormat = "DD MM YYYY";
    // Initialize Firebase
    this.firebase.initializeApp(firebaseConfig);
    this.firebase.analytics();
    if (this.firebase) {
      this.firebase.firestore().collection("blocks").get().then(snap => {
        const startedBlocks = [];
        snap.forEach(doc => startedBlocks.push(doc.data()));
        const earnedBlocks = startedBlocks
          // .filter(block => moment(moment(block.startTime).format(dateFormat)).isSame(moment().format(dateFormat)))
          // .filter(block => block.completed);
        this.setState({ earnedBlocks });
      });
      this.firebase.firestore().collection("goals").get().then(snap => {
        snap.forEach(doc => console.log(doc.data()));
      });
    }
  }

  render() {
    const { isDistracted, running, workdayStartTime, workdayEndTime, hours, minutes, seconds, distractions } = this.state;
    const blocks = [];
    let numBlocks = moment.duration(moment(workdayEndTime).diff(workdayStartTime)).asHours()
    while (numBlocks >= 0) {
      blocks.push({ completed: false });
      numBlocks--;
    }
    console.log(">>", this.state.earnedBlocks);
    //"#080705"
    const IS_DISTRACTION_TIMER = false;
    // "rgb(20,22,35)"
    // backgroundColor: "rgb(28,35,54)",
    return (
      <View style={{ display: "flex", flexDirection: "column", width: 267, backgroundColor: "black", alignItems: "center" }}>
        {/* <p>Workday Duration</p>
        <TimeField
          startTime={workdayStartTime}
          endTime={workdayEndTime}
          onStartChange={this._onStartTimeChange}
          onEndChange={this._onEndTimeChange}
          hourDifference={6}
        /> */}
        <View style={{ paddingHorizontal: 20, border: "1px solid rgb(38,38,38)", borderRadius: 0, paddingBottom: 20 }}>
          <Timer
            hours={1}
            minutes={0}
            seconds={0}
            running={running}
            paused={isDistracted}
            onTick={(hours, minutes, seconds) => this.setState({ hours, minutes, seconds })}
            onModify={this._onTimerModify}
            onFinish={this._onTimerFinish}
          />
          {/* <View style={{ width: 220 }}>
            <BlockProgress
              progressPercent={100 - (hours * 60 + minutes + (seconds/60.0))/60.0 * 100}
              marks={distractions.map(d => 100 - (d.hours * 60 + d.minutes + (d.seconds/60.0))/60.0 * 100 )}
            />
          </View> */}
          {this._renderEarnedBlocks([...this.state.earnedBlocks, this.state.currentBlock].filter(e => e !== null))}
        </View>
        <View style={{ marginVertical: 40 }}>
          <TouchableOpacity style={{ 
            backgroundColor: running || isDistracted ? "rgb(28,35,54)" : "rgb(209,63,87)", //"rgb(25,31,51)",
            borderRadius: 80, width: 80, height: 80,
            display: "flex",
            justifyContent: "center",
            shadowColor: 'rgba(0,0,0, .4)', // IOS
            shadowOffset: { height: 1, width: 1 }, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            elevation: 2, // Android
            }} onPress={running || isDistracted ? this._endBlock : this._startBlock}>
            <Text style={{ fontWeight: "bold", marginBottom: 2, color: "white" }}>{running || isDistracted ? "Give up" : "Start"}</Text>
          </TouchableOpacity>
        </View>
        {isDistracted && (
            <Timer
              hours={0}
              minutes={0}
              seconds={0}
              isCountUp
              small
              onTick={(dHours, dMinutes, dSeconds) => this.setState({ dHours, dMinutes, dSeconds })}
              running={isDistracted}
              onFinish={this._onDistractionFinish}
            />
        )}
        {/* {IS_DISTRACTION_TIMER ? (
            <button
              disabled={!running && !isDistracted}
              onClick={isDistracted ? this._onDistractionFinish : this._onDistractionStart}
            >
              {isDistracted ? "Stop Distraction" : "Distracted"}
            </button>
          ) : (
            <button
              disabled={!running && !isDistracted}
              onClick={this._onLogDistraction}
            >
              Log Distraction
            </button>
          )
        }
        {this._renderDistractions()} */}
      </View>
    );
  }

  _renderEarnedBlocks = blocks => <TimeBlocks blocks={blocks} />;

  _renderDistractions = () => (
    <div style={{ fontSize: 16 }}>
      <p style={{ fontSize: 22 }}>Distractions</p>
      {this.state.distractions.length === 0 && <p>No distractions</p>}
      {this.state.distractions.map(({ elapsedHours, elapsedMinutes, elapsedSeconds, createdAt }) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>At {moment(createdAt).format('hh:mm:ss')}</p>
          <p>{elapsedHours} : {elapsedMinutes} : {elapsedSeconds}</p>
        </div>
      ))}
    </div>
  );

  _onTimerModify = ({ hours, minutes, seconds }) => this.setState({
    hours,
    minutes,
    seconds,
    setHours: hours,
    setMinutes: minutes,
    setSeconds: seconds
  });

  _onTimerFinish = () => this._endBlock(true);

  _endBlock = (completed = false) => {
    const {
      hours,
      minutes,
      seconds,
      setHours,
      setMinutes,
      setSeconds
    } = this.state;
    this.setState({ running: false, isDistracted: false });
    this._logTimeBlock(setHours - hours, setMinutes - minutes, setSeconds - seconds, completed);
  };

  _startBlock = () => {
    const { running, isDistracted, distractions } = this.state;
    if (!isDistracted) {
      const currentBlock = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        createdAt: moment().toISOString(),
        startTime: moment().toISOString(),
        endTime: null,
        completed: false
      };
      this.setState({ running: !running, distractions: !running ? [] : distractions, currentBlock });
    }
  }

  _onLogDistraction = () => this.setState({
    distractions: [
      {
        createdAt: moment().toISOString(),
        hours: this.state.hours,
        minutes: this.state.minutes,
        seconds: this.state.seconds,
        elapsedHours: 0,
        elapsedMinutes: 0,
        elapsedSeconds: 0
      },
      ...this.state.distractions
    ]
  });

  _onDistractionStart = () => this.setState({ running: false, isDistracted: true });

  _onDistractionFinish = () => {
    const { dHours, dMinutes, dSeconds } = this.state;
    this._logDistraction(dHours, dMinutes, dSeconds);
    this._resetDistraction();
    this.setState({ running: true });
  };

  _resetDistraction = () => this.setState({ dHours: 0, dMinutes: 0, dSeconds: 0, isDistracted: false });

  _logDistraction = (hours, minutes, seconds) => {
    const { distractions } = this.state;
    const newDistraction = {
      createdAt: moment().toISOString(),
      hours,
      minutes,
      seconds,
      elapsedHours: hours,
      elapsedMinutes: minutes,
      elapsedSeconds: seconds
    };
    this.setState({ distractions: [newDistraction, ...distractions] });
  };

  _logTimeBlock = (elapsedHours, elapsedMinutes, elapsedSeconds, completed = false) => {
    const { setHours, setMinutes, setSeconds, currentBlock } = this.state;
    logTimeBlock(
      this.firebase,
      {
        ...currentBlock,
        hours: setHours,
        minutes: setMinutes,
        seconds: setSeconds,
        elapsedHours,
        elapsedMinutes,
        elapsedSeconds,
        endTime: moment().toISOString(),
        distractions: this.state.distractions,
        completed
      }
    );
  };

  _onStartTimeChange = workdayStartTime => this.setState({ workdayStartTime });

  _onEndTimeChange = workdayEndTime => this.setState({ workdayEndTime });
}
