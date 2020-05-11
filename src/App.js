import React from "react";
import { View, Text, Dimensions }from "react-native";
import moment from "moment";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import './App.css';
import AppContext from "./app-context";
import { TimerScreen } from "./timer-screen";
import { GoalsScreen } from "./goals-screen";
import { LogScreen } from "./log-screen";
import { AuthScreen } from "./auth-screen";
import { SettingsScreen } from "./settings-screen";

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

class FirebaseService {
  firebase = global.firebase;

  constructor(config, username = null) {
    // Initialize Firebase
    this.firebase.initializeApp(config);
    this.firebase.analytics();
    this.username = username;
  }

  fetchBlocks = async () => {
    const dateFormat = "DD MM YYYY";
    if (this.firebase && this.username) {
      const blocks = [];
      const collection = this.firebase.firestore().collection("blocks")
      const snapshot = await (this.username
        ? collection.where("username", "==", this.username).get()
        : collection.get());
      snapshot.forEach(doc => blocks.push({ id: doc.id, ...doc.data() }));
      console.log(`Log: Fetched ${blocks.length} blocks`, blocks);
      const todaysBlocks = blocks
        .filter(block => moment(moment(block.startTime).format(dateFormat)).isSame(moment().format(dateFormat)));
        console.log(`Log: Fetched ${todaysBlocks.length} today's blocks`, todaysBlocks)
      const startedBlocks = blocks.filter(block => !block.completed);
      const earnedBlocks = blocks.filter(block => block.completed);
      console.log(`Log: Filtered ${startedBlocks.length} started blocks`, startedBlocks);
      console.log(`Log: Filtered ${earnedBlocks.length} earned blocks`, earnedBlocks);
      return { startedBlocks, earnedBlocks, todaysBlocks };
    }
    return null;
  };

  fetchGoals = async () => {
    if (this.firebase && this.username) {
      const goals = [];
      const collection = this.firebase.firestore().collection("goals")
      const snapshot = await (this.username
        ? collection.where("username", "==", this.username).get()
        : collection.get());
      snapshot.forEach(doc => goals.push({ ...doc.data(), id: doc.id }));
      console.log(`Log: Fetched ${goals.length} goals`, goals);
      return goals;
    }
    return null;
  };

  addTimeBlock = async block => {
    if (this.firebase && this.username) {
      const newBlock = await this.firebase.firestore()
        .collection("blocks")
        .add({
          ...block,
          username: this.username
        });
      console.log("Log: 1 new block created", newBlock);
      return newBlock;
    }
  };

  updateTimeBlock = block => {
    if (this.firebase && this.username) {
      this.firebase.firestore()
        .collection("blocks")
        .doc(block.id)
        .update({ ...block, username: this.username });
    }
  }

  addGoal = async goal => {
    if (this.firebase && this.username) {
      await this.firebase.firestore()
        .collection("goals")
        .add({ ...goal, username: this.username });
    }
  }

  updateGoal = async goal => {
    if (this.firebase && this.username) {
      await this.firebase.firestore()
        .collection("goals")
        .doc(goal.id)
        .update({ ...goal, username: this.username });
    }
  };

  setCurrentUser = user => {
    if (user) {
      this.user = user;
      this.username = user.uid;
    }
  };
}

class AuthService {
  firebase = global.firebase;
  operations = {
    SignIn: "SignIn",
    SignUp: "SignUp"
  };

  constructor() {
    this.currentUser = this.firebase.auth().currentUser;
    this._setAuthPersistence();
  }

  getCurrentUser = () => this.firebase.auth().currentUser;

  signUp = (email, password, onSuccess = () => {}, onError = () => {}) => {
    if (this.firebase) {
      this.firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(data => {
          console.log("Log: Auth - Signup success");
          if (onSuccess) {
            onSuccess(data);
          }
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`Error: Auth Signup - (${errorCode}) ${errorMessage}`);
          if (onError) {
            onError(errorMessage);
          }
        });
    }
  };

  signIn = (email, password, onSuccess = () => {}, onError = () => {}) => {
    if (this.firebase) {
      this.firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(data => {
          console.log("Log: Auth - Signin success");
          if (onSuccess) {
            onSuccess(data);
          }
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`Error: Auth Signin - (${errorCode}) ${errorMessage}`);
          if (onError) {
            onError(errorMessage);
          }
        });
    }
  }

  signOut = () => {
    if (this.firebase) {
      this.firebase.auth().signOut().then(function() {
        console.log('Log: Auth - Signed Out');
      }, function(error) {
        console.error('Error: Auth - Sign Out Error', error);
      });
    }
  };

  onAuthStateChanged = cb => {
    if (this.firebase) {
      this.firebase.auth().onAuthStateChanged(user => cb(user));
    }
  };

  _setAuthPersistence = () => {
    if (this.firebase) {
      this.firebase.auth()
        .setPersistence(this.firebase.auth.Auth.Persistence.LOCAL)
        .then(() => console.log("Log: Auth persistence set"))
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`Error: Auth Persistence - (${errorCode}) ${errorMessage}`);
        });
    }
  }
}

class App extends React.Component {
  firebase = global.firebase;

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      authLoading: true
    };
  }

  componentWillMount() {
    this.service = new FirebaseService(FIREBASE_CONFIG);
    this.authService = new AuthService();
    this.authService.onAuthStateChanged(user => {
      if (user) {
        console.log("Auth: Logged in user", user.uid);
      }
      this._setCurrentUser(user);
      this.setState({ authLoading: false });
    });
  }

  render = () => {
    const { currentUser, authLoading } = this.state;
    if (authLoading) {
      return (
        <div className="App">
          <div className="App-header">
            <View style={{ width: "100%", height: "100%", backgroundColor: "black" }} />
          </div>
        </div>
      );
    }
    return (
      <AppContext.Provider value={{
        remoteService: this.service,
        authService: this.authService,
        currentUser
      }}>
        <div className="App">
          <div className="App-header">
            <Router basename="/time-blocks">
              <View style={{ height: Dimensions.get("window").height - 60, width: "100%", display: "flex", alignItems: "center" }}>
                <Switch>
                  <Route path="/log">
                    <LogScreen />
                  </Route>
                  <Route path="/goals">
                    <GoalsScreen />
                  </Route>
                  <Route path="/settings">
                    <SettingsScreen />
                  </Route>
                  <Route path="/auth">
                    <AuthScreen />
                  </Route>
                  <Route path="/">
                    <TimerScreen />
                  </Route>
                </Switch>
              </View>
              {currentUser === null
                ? <Redirect to="/auth" />
                : <Redirect to="/" />
              }
              {currentUser !== null ? (
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
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Link to={`log${window.location.search}`}>
                      <View style={{ height: "100%", paddingHorizontal: 10, width: 80 }}>
                        <Text style={{ color: "#999999", fontSize: 14 }}>
                          Log
                        </Text>
                      </View>
                    </Link>
                    <Link to={`/${window.location.search}`}>
                      <View style={{ height: "100%", paddingHorizontal: 10, width: 80 }}>
                        <Text style={{ color: "#999999", fontSize: 14 }}>
                          Focus
                        </Text>
                      </View>
                    </Link>
                    <Link to={`goals${window.location.search}`}>
                      <View style={{ height: "100%", paddingHorizontal: 10, width: 80 }}>
                        <Text style={{ color: "#999999", fontSize: 14 }}>
                          Goals
                        </Text>
                      </View>
                    </Link>
                    <Link to={`settings${window.location.search}`}>
                      <View style={{ height: "100%", paddingHorizontal: 10, width: 80 }}>
                        <Text style={{ color: "#999999", fontSize: 14 }}>
                          Settings
                        </Text>
                      </View>
                    </Link>
                  </View>
                </View>
              ) : null}
            </Router>
          </div>
        </div>
      </AppContext.Provider>
    );
  };

  _setCurrentUser = currentUser => {
    if (currentUser && currentUser.email) {
      this.setState({ currentUser: currentUser.email });
      this.service.setCurrentUser(currentUser);
    } else {
      this.setState({ currentUser: null });
    }
  };
}

export default App;
