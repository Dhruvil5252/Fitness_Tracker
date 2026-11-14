import { useState, useEffect } from "react";
import { getWorkoutPlans } from "./services/workout.api";
import { WorkoutContext } from "./workoutContext";

export const WorkoutProvider = ({ children }) => {

    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAndSetWorkoutPlans = async () => {
            try {
                const data = await getWorkoutPlans();
                setWorkoutPlans(data.plans || []);
                setWorkoutPlan(data.plans?.[0] || null);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        getAndSetWorkoutPlans();
    }, []);

    return (
        <WorkoutContext.Provider
            value={{ workoutPlans, setWorkoutPlans, workoutPlan, setWorkoutPlan, loading, setLoading }}
        >
            {children}
        </WorkoutContext.Provider>
    );
};
