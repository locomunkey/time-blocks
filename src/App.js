import React from "react";
import { View, Text, Dimensions }from "react-native";
import moment from "moment";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import { TimerScreen } from "./timer-screen";
import { GoalsScreen } from "./goals-screen";
import { LogScreen } from "./log-screen";
import AppContext from "./app-context";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCBZrwH6IoMDo-jW2Ydu00z0FJMK3wQdTI",
  authDomain: "timeblocks-bb1cc.firebaseapp.com",
  databaseURL: "https://timeblocks-bb1cc.firebaseio.com",
  projectId: "timeblocks-bb1cc",
  storageBucket: "timeblocks-bb1cc.appspot.com",
  messagingSenderId: "689367456633",
  appId: "1:689367456633:web:6cb0b27d54e4c45f9bada8",
  measurementId: "G-92KBT48GWG"
};

class App extends React.Component {
  firebase = global.firebase;

  componentWillMount() {
    // Initialize Firebase
    this.firebase.initializeApp(FIREBASE_CONFIG);
    this.firebase.analytics();
  }

  render = () => (
    <AppContext.Provider value={{
      remoteService: {
        fetchBlocks: this._fetchBlocks,
        fetchGoals: this._fetchGoals,
        updateGoal: this._updateGoal,
        addTimeBlock: this._addTimeBlock
      }
    }}>
      <div className="App">
        <div className="App-header">
          <Router basename="time-blocks">
            <View style={{ height: Dimensions.get("window").height - 60, width: "100%", display: "flex", alignItems: "center" }}>
              <Switch>
                <Route path="/log">
                  <LogScreen />
                </Route>
                <Route path="/goals">
                  <GoalsScreen />
                </Route>
                <Route path="/">
                  <TimerScreen />
                </Route>
              </Switch>
            </View>
            <View style={{
              borderTop: "1px solid rgb(38,38,38)",
              width: "100%",
              position: "absolute",
              bottom: 0,
              backgroundColor: "black",
              height: 60,
              display: "flex",
              alignItems: "center"
            }}>
              <View style={{
                width: "100%",
                height: "100%",
                // maxWidth: 267,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Link to={`log${window.location.search}`}>
                  <View style={{ height: "100%", paddingHorizontal: 10, width: 70 }}>
                    <Text style={{ color: "#999999", fontSize: 14 }}>
                      Log
                    </Text>
                  </View>
                </Link>
                <Link to={`/${window.location.search}`}>
                  <View style={{ height: "100%", paddingHorizontal: 10, width: 70 }}>
                    <Text style={{ color: "#999999", fontSize: 14 }}>
                      Focus
                    </Text>
                  </View>
                </Link>
                <Link to={`goals${window.location.search}`}>
                  <View style={{ height: "100%", paddingHorizontal: 10, width: 70 }}>
                    <Text style={{ color: "#999999", fontSize: 14 }}>
                      Goals
                    </Text>
                  </View>
                </Link>
              </View>
            </View>
          </Router>
        </div>
      </div>
    </AppContext.Provider>
  );

  _fetchBlocks = async () => {
    const dateFormat = "DD MM YYYY";
    if (this.firebase) {
      const blocks = [];
      const collection = this.firebase.firestore().collection("blocks");
      const username = this._getUsername();
      const snapshot = await (username
        ? collection.where("username", "==", username).get()
        : collection.get());
      snapshot.forEach(doc => blocks.push({ id: doc.id, ...doc.data() }));
      console.log(`Log: Fetched ${blocks.length} blocks`, blocks);
      const todaysBlocks = blocks
        .filter(block => moment(moment(block.startTime).format(dateFormat)).isSame(moment().format(dateFormat)));
      const startedBlocks = blocks.filter(block => !block.completed);
      const earnedBlocks = blocks.filter(block => block.completed);
      console.log(`Log: Filtered ${startedBlocks.length} started blocks`, startedBlocks);
      console.log(`Log: Filtered ${earnedBlocks.length} earned blocks`, earnedBlocks);
      return { startedBlocks, earnedBlocks, todaysBlocks };
    }
    return null;
  }

  _fetchGoals = async () => {
    if (this.firebase) {
      const goals = [];
      const collection = this.firebase.firestore().collection("goals");
      const username = this._getUsername();
      const snapshot = await (username
        ? collection.where("username", "==", username).get()
        : collection.get());
      snapshot.forEach(doc => goals.push({ id: doc.id, ...doc.data() }));
      console.log(`Log: Fetched ${goals.length} goals`, goals);
      return goals;
    }
    return null;
  }

  _addTimeBlock = block => {
    const username = this._getUsername();
    if (this.firebase) {
      this.firebase.firestore().collection("blocks").add({
        ...block,
        username
      });
    }
  }

  _updateGoal = async goal => {
    if (this.firebase) {
      const username = this._getUsername();
      await this.firebase.firestore()
        .collection("goals")
        .doc(goal.id)
        .update({ ...goal, username: username });
    }
  }

  _getUsername = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("username");
  }
}

export default App;
