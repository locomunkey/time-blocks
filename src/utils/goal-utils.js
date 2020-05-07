import moment from "moment";

export default class GoalUtils {
  static getTodaysBlockGoal(goal) {
    if (!goal) {
      return 0;
    }
    let parsedGoal = goal;
    if (goal.everyday !== null) {
      parsedGoal = {
        ...parsedGoal,
        mon: goal.everyday,
        tue: goal.everyday,
        wed: goal.everyday,
        thu: goal.everyday,
        fri: goal.everyday,
        sat: goal.everyday,
        sun: goal.everyday
      };
    }
    if (goal.weekdays !== null) {
      parsedGoal = {
        ...parsedGoal,
        mon: goal.weekdays,
        tue: goal.weekdays,
        wed: goal.weekdays,
        thu: goal.weekdays,
        fri: goal.weekdays
      };
    }
    if (goal.weekends !== null) {
      parsedGoal = {
        ...parsedGoal,
        sat: goal.weekends,
        sun: goal.weekends
      }
    }
    const dayOfWeek = moment().format("ddd").toLowerCase();
    const parsedGoalBlocks = parseInt(parsedGoal[dayOfWeek]);
    return isNaN(parsedGoalBlocks) ? 0 : parsedGoalBlocks;
  }
}
