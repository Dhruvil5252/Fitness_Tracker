import { useContext } from "react";
import { WorkoutContext } from "../workoutContext";
import { createWorkoutPlan, getWorkoutPlans } from "../services/workout.api";

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  const {
    workoutPlans,
    setWorkoutPlans,
    workoutPlan,
    setWorkoutPlan,
    loading,
    setLoading,
  } = context;

  const handleCreateWorkoutPlan = async ({ planName, days }) => {
    setLoading(true);
    try {
      const data = await createWorkoutPlan({ planName, days });
      setWorkoutPlans((prev) => [data.plan, ...prev]);
      setWorkoutPlan(data.plan);
    } finally {
      setLoading(false);
    }
  };

  const handleGetWorkoutPlans = async () => {
    setLoading(true);
    try {
      const data = await getWorkoutPlans();
      setWorkoutPlans(data.plans || []);
      setWorkoutPlan(data.plans?.[0] || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    workoutPlans,
    setWorkoutPlans,
    workoutPlan,
    setWorkoutPlan,
    loading,
    handleCreateWorkoutPlan,
    handleGetWorkoutPlans,
  };
};
