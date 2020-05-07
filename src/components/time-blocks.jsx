import React from "react";
import { View } from "react-native";
import GoalUtils from "../utils/goal-utils";

const BlockProgress = ({ progressPercent, marks }) => (
  <div style={{ position: "relative", height: 13, width: 13, marginRight: 2, marginTop: 2, backgroundColor: "gray" }}>
    <div style={{ width: `${Math.max(Math.ceil(progressPercent), 3)}%`, backgroundColor: "rgb(97,196,85)", height: "100%" }} />
    {marks && marks.map(mark => (
      <div style={{ position: "absolute", left: `${mark}%`, height: "100%", width: 2, top: 0, backgroundColor: "red" }} />  
    ))}
  </div>
);

const getBlockProgress = block => 100 - (block.hours * 60 + block.minutes + (block.seconds/60.0))/60.0 * 100;

const TimeBlock = ({ block, isGoal }) => block && !block.completed
  ? <BlockProgress progressPercent={getBlockProgress(block)} isGoal={isGoal} />
  : (
    <View style={{
      width: 13,
      height: 13,
      marginRight: 2,
      marginTop: 2,
      backgroundColor: block
        ? "rgb(97,196,85)"
        : "gray"
    }} />
  );

const TimeBlocks = ({ earnedBlocks, currentBlock, goal }) => {
  const blockGoal = Math.max(
    GoalUtils.getTodaysBlockGoal(goal) - earnedBlocks.length - (currentBlock ? 1 : 0),
    0
  );
  return (
    <View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
      {earnedBlocks.map(block => <TimeBlock block={block} />)}
      {currentBlock && <TimeBlock block={currentBlock} isGoal={blockGoal - 1 > 0} />}
      {Array.from(new Array(blockGoal)).map(() => <TimeBlock isGoal />)}
    </View>
  );
};

export default TimeBlocks;
