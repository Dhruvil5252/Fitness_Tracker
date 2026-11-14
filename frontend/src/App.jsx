import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context";
import { WorkoutProvider } from "./features/workout/workout.context";

const App = () => {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <RouterProvider router={router} />
      </WorkoutProvider>
    </AuthProvider>
  );
};

export default App;
