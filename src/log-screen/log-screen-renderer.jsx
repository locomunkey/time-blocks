import React from "react";
import moment from "moment";
import { View, Text, Dimensions } from "react-native";
import TimeBlocks from "../components/time-blocks";
import GoalUtils from "../utils/goal-utils";

const LogItem = ({ day, goal }) => {
  const earnedBlocks = day.blocks.filter(block => block.completed);
  const earnedBlocksCount = earnedBlocks.length * 1.0
  const goalCount = GoalUtils.getTodaysBlockGoal(goal);
  const goalPercent = day.blocks && day.blocks.length > 0
    ? (earnedBlocksCount / (goalCount > 0 ? goalCount : 1)) * 100
    : 0;
  return (
    <View style={{ height: 90, borderBottom: "1px solid rgb(38,38,38)", paddingTop: 10, width: "100%", display: "flex", alignItems: "center", marginHorizontal: 5 }}>
      <View style={{ maxWidth: 267, height: "100%", width: "100%" }}>
        <View style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Text style={{ color: "white", fontSize: 17 }}>{moment(day.date).format("D MMMM YYYY")}</Text>
          <Text style={{ color: "white", fontSize: 10 }}>Sessions: {day.blocks && day.blocks.length > 0 ? day.blocks.length : "N/A"}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: 10 }}>
          <View style={{ display: "flex", width: "75%" }}>
            <TimeBlocks earnedBlocks={earnedBlocks} goal={goal} />
          </View>
          <View style={{ display: "flex", alignItems: "center", marginLeft: 5 }}>
            <Text style={{ color: "white", fontSize: 16 }}>{goalPercent.toFixed(0)}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export const LogScreenRenderer = ({ days, goal }) => (
  <View style={{
    display: "flex",
    flexDirection: "column",
    height: Dimensions.get("window").height - 60,
    overflow: "scroll",
    width: "100%",
    alignItems: "center",
    backgroundColor: "black",
    paddingBottom: 60
  }}>
    {days.map(day => <LogItem day={day} goal={goal} />)}
  </View>
);
