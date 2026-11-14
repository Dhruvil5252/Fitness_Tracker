import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  ArrowRight,
  Dumbbell,
  Flame,
  LayoutDashboard,
  LineChart,
  MessageSquareText,
  Moon,
  Plus,
  Scale,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useWorkout } from "../hooks/useWorkout";
import "../homePage.scss";

const navItems = [
  { to: "/", ariaLabel: "Dashboard", title: "Dashboard", icon: LayoutDashboard },
  { to: "/workout", ariaLabel: "Workout plan", title: "Workout", icon: Dumbbell },
  { to: "/diet", ariaLabel: "Diet", title: "Diet", icon: Utensils },
  { to: "/coach", ariaLabel: "AI Coach", title: "AI Coach", icon: Sparkles },
  { to: "/progress", ariaLabel: "Progress", title: "Progress", icon: LineChart },
];

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extreme: 1.9,
};

const goalAdjustments = {
  bulk: 300,
  cut: -500,
  muscle: 200,
  maintain: 0,
};

const getDailyCalorieTarget = (user) => {
  const { age, weight, height, gender, activityLevel, goal } = user || {};
  const activityMultiplier = activityMultipliers[activityLevel];

  if (!age || !weight || !height || !activityMultiplier || goalAdjustments[goal] === undefined) {
    return null;
  }

  const genderAdjustment = gender === "Male" ? 5 : gender === "Female" ? -161 : -78;
  const basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age + genderAdjustment;
  return Math.round(basalMetabolicRate * activityMultiplier + goalAdjustments[goal]);
};

const getWorkoutState = (plan, date) => {
  const days = plan?.days || [];
  if (days.length === 0) return { type: "no-plan" };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[date.getDay()];
  const todayWorkoutIndex = days.findIndex(({ day }) => day === todayName);

  if (todayWorkoutIndex !== -1) {
    return {
      type: "workout",
      workout: days[todayWorkoutIndex],
      workoutIndex: todayWorkoutIndex,
      planName: plan.planName,
      planDayCount: days.length,
    };
  }

  for (let daysUntil = 1; daysUntil <= 7; daysUntil += 1) {
    const nextDayName = dayNames[(date.getDay() + daysUntil) % dayNames.length];
    const nextWorkout = days.find((day) => day.day === nextDayName);
    if (nextWorkout) {
      return {
        type: "rest",
        nextWorkout,
        daysUntil,
        planName: plan.planName,
      };
    }
  }

  return { type: "no-plan" };
};

const WeightTrendCard = ({ weight }) => (
  <article className="dashboard-card weight-card">
    <div className="dashboard-card__heading">
      <h2 className="dashboard-card__title">Weight trend</h2>
      <p>
        {weight ? (
          <strong>{weight} kg</strong>
        ) : (
          <Link className="weight-card__add-link" to="/profile">
            Add your weight
          </Link>
        )}
        {weight && <span>start</span>}
      </p>
    </div>
    <div className="weight-card__chart" aria-label="No weight trend recorded yet">
      <span className="weight-card__point" />
      <span className="weight-card__line" />
    </div>
    <div className="weight-card__progress" />
    <p className="dashboard-card__caption">Log a weigh-in to start your trend</p>
  </article>
);

const Home = () => {
  const { user, handleLogout } = useAuth();
  const { workoutPlans } = useWorkout();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const username = user?.username?.split(" ")[0] || "Athlete";
  const firstNameInitial = username.charAt(0).toUpperCase();
  const workoutState = getWorkoutState(workoutPlans[0], new Date());
  const dailyCalorieTarget = getDailyCalorieTarget(user);

  const currentDate = new Intl.DateTimeFormat("en", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  }).format(new Date());

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  const handleLogOut = async () => {
    setMenuOpen(false);
    await handleLogout();
    navigate("/login");
  };

  return (
    <main className="dashboard-screen">
      <div className="dashboard-app">
        <aside className="dashboard-rail" aria-label="Main navigation">
          <div className="dashboard-rail__brand" aria-label="FitTrack home" title="FitTrack">
            <img src="/logo.png" alt="FitTrack logo" />
          </div>

          <nav className="dashboard-rail__nav">
            {navItems.map(({ to, ariaLabel, title, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => `dashboard-rail__link ${isActive ? "is-active" : ""}`}
                aria-label={ariaLabel}
                title={title}
              >
                <Icon size={18} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="dashboard-main">
          <header className="dashboard-header">
            <div className="dashboard-header__copy">
              <p className="dashboard-header__date">{currentDate}</p>
              <h1>
                {greeting}, {username}
              </h1>
            </div>

            <div className="dashboard-header__actions">
              <div className="dashboard-header__streak">
                <Flame size={15} aria-hidden="true" />
                <span>Start your streak</span>
              </div>

              <div className="dashboard-header__avatar-wrap">
                <button
                  type="button"
                  className="dashboard-header__avatar"
                  aria-label="Open account menu"
                  title="Account"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  {firstNameInitial}
                </button>

                {menuOpen && (
                  <div className="dashboard-header__menu" role="menu" aria-label="Account menu">
                    <Link to="/profile" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Profile
                    </Link>
                    <button type="button" role="menuitem" onClick={handleLogOut}>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <section className="dashboard-top-grid" aria-label="Today's overview">
            <article className="dashboard-card dashboard-card--featured">
              {workoutState.type === "workout" ? (
                <div className="plan-card plan-card--workout">
                  <div className="plan-card__icon">
                    <Dumbbell size={24} aria-hidden="true" />
                  </div>
                  <span className="dashboard-eyebrow">TODAY</span>
                  <span className="today-plan-caption">
                    {workoutState.planName || "My Workout Plan"} · Day {workoutState.workoutIndex + 1} of {workoutState.planDayCount}
                  </span>
                  <h2>{workoutState.workout.workoutName}</h2>
                  <p className="today-workout__summary">
                    {workoutState.workout.exercises.length} exercises · {workoutState.workout.exercises.reduce(
                      (total, exercise) => total + (exercise.sets?.length || exercise.totalSets || 0),
                      0,
                    )} sets
                  </p>
                  <div className="today-workout__exercises">
                    {workoutState.workout.exercises.slice(0, 3).map((exercise) => (
                      <div className="today-workout__exercise" key={exercise.name}>
                        <span className="today-workout__exercise-name">{exercise.name}</span>
                        <span className="today-workout__sets">
                          {exercise.sets?.slice(0, 3).map((set, index) => (
                            <span className="today-workout__set-chip" key={`${exercise.name}-${index}`}>
                              {set.reps} x {set.weight > 0 ? `${set.weight} ${exercise.weightUnit || "kg"}` : "BW"}
                            </span>
                          ))}
                          {exercise.sets?.length > 3 && (
                            <span className="today-workout__set-chip">+{exercise.sets.length - 3}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="dashboard-button dashboard-button--primary"
                    type="button"
                    disabled
                    title="Workout tracking is not available yet"
                  >
                    <Dumbbell size={16} aria-hidden="true" />
                    Start workout
                  </button>
                </div>
              ) : workoutState.type === "rest" ? (
                <div className="plan-card plan-card--rest">
                  <div className="plan-card__icon">
                    <Moon size={24} aria-hidden="true" />
                  </div>
                  <span className="dashboard-eyebrow">TODAY</span>
                  <span className="today-plan-caption">
                    {workoutState.planName || "My Workout Plan"}
                  </span>
                  <h2>Rest day</h2>
                  <div className="today-next-workout">
                    <span className="today-next-workout__label">
                      NEXT WORKOUT · IN {workoutState.daysUntil} {workoutState.daysUntil === 1 ? "DAY" : "DAYS"}
                    </span>
                    <strong>{workoutState.nextWorkout.day}</strong>
                    <span>{workoutState.nextWorkout.workoutName}</span>
                  </div>
                  <button className="dashboard-link" type="button" disabled>
                    View plan <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="plan-card plan-card--empty">
                  <div className="plan-card__icon">
                    <Dumbbell size={24} aria-hidden="true" />
                  </div>
                  <span className="dashboard-eyebrow">TODAY</span>
                  <h2>No workout plan yet</h2>
                  <p>
                    Build your own plan, or let the AI coach create one for your fitness goal.
                  </p>
                  <div className="plan-card__actions">
                    <button
                      className="dashboard-button dashboard-button--primary"
                      type="button"
                      disabled
                      title="Workout plan editor is not available yet"
                    >
                      <Plus size={16} aria-hidden="true" />
                      Create plan
                    </button>
                    <button className="dashboard-button" type="button" disabled>
                      <MessageSquareText size={16} aria-hidden="true" />
                      Generate with AI
                    </button>
                  </div>
                </div>
              )}
            </article>

            <article className="dashboard-card nutrition-card">
              <h2 className="dashboard-card__title">Nutrition</h2>
              <div
                className="nutrition-card__ring"
                role="img"
                aria-label={`0 of ${dailyCalorieTarget ?? "unavailable"} calories logged today`}
              >
                <div>
                  <strong>0</strong>
                  <span>of {dailyCalorieTarget?.toLocaleString() ?? "--"}</span>
                </div>
              </div>
              <div className="nutrition-card__macros">
                <div>
                  <strong>0g</strong>
                  <span>Protein</span>
                </div>
                <div>
                  <strong>0g</strong>
                  <span>Carbs</span>
                </div>
                <div>
                  <strong>0g</strong>
                  <span>Fats</span>
                </div>
              </div>
              <button className="dashboard-link" type="button" disabled>
                Log your first meal <ArrowRight size={15} aria-hidden="true" />
              </button>
            </article>
          </section>

          <section className="dashboard-quick-actions" aria-label="Quick actions">
            <button className="dashboard-quick-action" type="button" disabled>
              <Utensils size={18} aria-hidden="true" />
              <span>Log meal</span>
            </button>
            <button className="dashboard-quick-action" type="button" disabled>
              <Dumbbell size={18} aria-hidden="true" />
              <span>Log workout</span>
            </button>
            <button className="dashboard-quick-action" type="button" disabled>
              <Scale size={18} aria-hidden="true" />
              <span>Weigh in</span>
            </button>
            <button className="dashboard-quick-action" type="button" disabled>
              <Sparkles size={18} aria-hidden="true" />
              <span>Ask AI</span>
            </button>
          </section>

          <section className="dashboard-bottom-grid" aria-label="Progress and coaching">
            <WeightTrendCard weight={user?.weight} />

            <article className="dashboard-card consistency-card">
              <h2 className="dashboard-card__title">Consistency</h2>
              <div className="heatmap" aria-label="No activity logged yet">
                {Array.from({ length: 28 }, (_, index) => (
                  <span key={index} />
                ))}
              </div>
              <p className="dashboard-card__caption">0 of 28 days active</p>
            </article>

            <article className="dashboard-card coach-card">
              <h2 className="dashboard-card__title">
                <MessageSquareText size={14} aria-hidden="true" /> AI Coach
              </h2>
              <p>
                {user?.goal
                  ? `Create your first plan and I will tailor it to your ${user.goal} goal.`
                  : "Create your first plan and your coach can help tailor it to your goals."}
              </p>
              <button className="dashboard-link" type="button" disabled>
                Ask a question <ArrowRight size={15} aria-hidden="true" />
              </button>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Home;
