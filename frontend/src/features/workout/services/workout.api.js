import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export async function createWorkoutPlan({ planName, days }) {
  try {
    const response = await api.post("/api/workout/workout-plan", {
      planName,
      days,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getWorkoutPlans() {
  try {
    const response = await api.get("/api/workout/workout-plan");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
