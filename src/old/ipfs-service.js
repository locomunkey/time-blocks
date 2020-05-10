// import { API } from "@textile/textile";
// import { Client } from "@textile/threads-client";
// import { Database } from "@textile/threads-database";

// class IPFSService {
//   constructor(username) {
//     this.username = username;
//   }

//   async initializeService() {
//     const api = new API({
//       token: "b5zlueka6e2fhebjqsynqk4uzwi",
//       deviceId: 'xyz'
//     });
//     await api.start();

//     const client = new Client(api.threadsConfig)
//     const store = client.newDB();
//     console.log(">>>", store);
//     this.store = store;
//   }

//   fetchBlocks = async () => {
//     const dateFormat = "DD MM YYYY";
//     if (this.firebase) {
//       const blocks = [];
//       const collection = this.firebase.firestore().collection("blocks");
//       const snapshot = await (this.username
//         ? collection.where("username", "==", this.username).get()
//         : collection.get());
//       snapshot.forEach(doc => blocks.push({ id: doc.id, ...doc.data() }));
//       console.log(`Log: Fetched ${blocks.length} blocks`, blocks);
//       const todaysBlocks = blocks
//         .filter(block => moment(moment(block.startTime).format(dateFormat)).isSame(moment().format(dateFormat)));
//       const startedBlocks = blocks.filter(block => !block.completed);
//       const earnedBlocks = blocks.filter(block => block.completed);
//       console.log(`Log: Filtered ${startedBlocks.length} started blocks`, startedBlocks);
//       console.log(`Log: Filtered ${earnedBlocks.length} earned blocks`, earnedBlocks);
//       return { startedBlocks, earnedBlocks, todaysBlocks };
//     }
//     return null;
//   }

//   fetchGoals = async () => {
//     if (this.firebase) {
//       const goals = [];
//       const collection = this.firebase.firestore().collection("goals");
//       const snapshot = await (this.username
//         ? collection.where("username", "==", this.username).get()
//         : collection.get());
//       snapshot.forEach(doc => goals.push({ id: doc.id, ...doc.data() }));
//       console.log(`Log: Fetched ${goals.length} goals`, goals);
//       return goals;
//     }
//     return null;
//   }

//   addTimeBlock = block => {
//     if (this.firebase) {
//       this.firebase.firestore().collection("blocks").add({
//         ...block,
//         username: this.username
//       });
//     }
//   }

//   updateGoal = async goal => {
//     if (this.firebase) {
//       await this.firebase.firestore()
//         .collection("goals")
//         .doc(goal.id)
//         .update({ ...goal, username: this.username });
//     }
//   }
// }