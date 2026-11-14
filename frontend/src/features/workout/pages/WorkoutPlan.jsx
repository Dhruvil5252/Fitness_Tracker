import { useState } from "react";
import { useNavigate } from "react-router";
import { useWorkout } from "../hooks/useWorkout";
import "../workoutPlan.scss";

const weekDays = [
  { name: "Monday", shortName: "Mon" },
  { name: "Tuesday", shortName: "Tue" },
  { name: "Wednesday", shortName: "Wed" },
  { name: "Thursday", shortName: "Thu" },
  { name: "Friday", shortName: "Fri" },
  { name: "Saturday", shortName: "Sat" },
  { name: "Sunday", shortName: "Sun" },
];

const createSet = () => ({ reps: "8", weight: "0" });

const createExercise = () => ({
  name: "",
  weightUnit: "kg",
  sets: [createSet()],
});

const createDay = (day) => ({
  day,
  workoutName: `${day} Workout`,
  exercises: [createExercise()],
});

const startingDays = [
  {
    day: "Monday",
    workoutName: "Chest Day",
    exercises: [
      {
        name: "Bench Press",
        weightUnit: "kg",
        sets: [
          { reps: "10", weight: "60" },
          { reps: "8", weight: "70" },
        ],
      },
    ],
  },
  {
    day: "Wednesday",
    workoutName: "Leg Day",
    exercises: [
      {
        name: "Squats",
        weightUnit: "kg",
        sets: [
          { reps: "12", weight: "60" },
          { reps: "10", weight: "70" },
        ],
      },
    ],
  },
];

const WorkoutPlan = () => {
  const navigate = useNavigate();
  const { handleCreateWorkoutPlan } = useWorkout();
  const [planName, setPlanName] = useState("My Strength Routine");
  const [days, setDays] = useState(startingDays);
  const [expandedDays, setExpandedDays] = useState(["Monday"]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateDay = (dayIndex, updates) => {
    setDays((currentDays) =>
      currentDays.map((day, index) =>
        index === dayIndex ? { ...day, ...updates } : day,
      ),
    );
    setSuccessMessage("");
  };

  const updateExercise = (dayIndex, exerciseIndex, updates) => {
    setDays((currentDays) =>
      currentDays.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((exercise, itemIndex) =>
                itemIndex === exerciseIndex ? { ...exercise, ...updates } : exercise,
              ),
            }
          : day,
      ),
    );
    setSuccessMessage("");
  };

  const updateSet = (dayIndex, exerciseIndex, setIndex, updates) => {
    setDays((currentDays) =>
      currentDays.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((exercise, itemIndex) =>
                itemIndex === exerciseIndex
                  ? {
                      ...exercise,
                      sets: exercise.sets.map((set, index) =>
                        index === setIndex ? { ...set, ...updates } : set,
                      ),
                    }
                  : exercise,
              ),
            }
          : day,
      ),
    );
    setSuccessMessage("");
  };

  const toggleDay = (dayName) => {
    const isSelected = days.some((day) => day.day === dayName);

    if (isSelected) {
      setDays((currentDays) => currentDays.filter((day) => day.day !== dayName));
      setExpandedDays((currentDays) => currentDays.filter((day) => day !== dayName));
    } else {
      setDays((currentDays) => [...currentDays, createDay(dayName)]);
      setExpandedDays((currentDays) => [...currentDays, dayName]);
    }

    setErrorMessage("");
    setSuccessMessage("");
  };

  const toggleExpandedDay = (dayName) => {
    setExpandedDays((currentDays) =>
      currentDays.includes(dayName)
        ? currentDays.filter((day) => day !== dayName)
        : [...currentDays, dayName],
    );
  };

  const addExercise = (dayIndex) => {
    const day = days[dayIndex];
    if (day.exercises.length >= 20) {
      setErrorMessage("Each workout day can have at most 20 exercises.");
      return;
    }

    updateDay(dayIndex, { exercises: [...day.exercises, createExercise()] });
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    updateDay(dayIndex, {
      exercises: days[dayIndex].exercises.filter((_, index) => index !== exerciseIndex),
    });
  };

  const addSet = (dayIndex, exerciseIndex) => {
    const exercise = days[dayIndex].exercises[exerciseIndex];
    if (exercise.sets.length >= 20) {
      setErrorMessage("Each exercise can have at most 20 sets.");
      return;
    }

    updateExercise(dayIndex, exerciseIndex, {
      sets: [...exercise.sets, createSet()],
    });
  };

  const removeSet = (dayIndex, exerciseIndex, setIndex) => {
    const exercise = days[dayIndex].exercises[exerciseIndex];
    if (exercise.sets.length <= 1) return;

    updateExercise(dayIndex, exerciseIndex, {
      sets: exercise.sets.filter((_, index) => index !== setIndex),
    });
  };

  const totalExercises = days.reduce((total, day) => total + day.exercises.length, 0);
  const totalSets = days.reduce(
    (total, day) =>
      total + day.exercises.reduce((dayTotal, exercise) => dayTotal + exercise.sets.length, 0),
    0,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!planName.trim()) {
      setErrorMessage("Please enter a plan name.");
      return;
    }

    if (days.length === 0) {
      setErrorMessage("Select at least one training day.");
      return;
    }

    const workoutPlan = {
      planName: planName.trim(),
      days: weekDays
        .filter(({ name }) => days.some((day) => day.day === name))
        .map(({ name }) => {
          const day = days.find((item) => item.day === name);
          return {
            ...day,
            workoutName: day.workoutName.trim(),
            exercises: day.exercises.map((exercise) => ({
              ...exercise,
              name: exercise.name.trim(),
              totalSets: exercise.sets.length,
              sets: exercise.sets.map((set, index) => ({
                setNumber: index + 1,
                reps: Number(set.reps),
                weight: Number(set.weight),
              })),
            })),
          };
        }),
    };

    setIsSaving(true);
    try {
      await handleCreateWorkoutPlan(workoutPlan);
      setSuccessMessage("Workout plan saved successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Unable to save workout plan.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="workout-plan-screen">
      <form className="workout-plan" onSubmit={handleSubmit}>
        <header className="workout-plan__header">
          <div>
            <h1>Create workout plan</h1>
            <p>Add your training days, exercises and sets.</p>
          </div>
          <div className="workout-plan__header-actions">
            <button
              className="workout-plan__button workout-plan__button--secondary"
              type="button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              className="workout-plan__button workout-plan__button--primary"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save plan"}
            </button>
          </div>
        </header>

        <label className="workout-plan__field-label" htmlFor="plan-name">
          Plan name
        </label>
        <input
          className="workout-plan__text-input workout-plan__plan-name"
          id="plan-name"
          type="text"
          value={planName}
          onChange={(event) => {
            setPlanName(event.target.value);
            setSuccessMessage("");
          }}
          maxLength={100}
          required
        />

        <section className="workout-plan__day-selector" aria-labelledby="training-days-label">
          <h2 id="training-days-label" className="workout-plan__field-label">
            Training days
          </h2>
          <div className="workout-plan__day-options">
            {weekDays.map(({ name, shortName }) => {
              const isSelected = days.some((day) => day.day === name);
              return (
                <button
                  className={`workout-plan__day-option${isSelected ? " is-selected" : ""}`}
                  type="button"
                  key={name}
                  aria-pressed={isSelected}
                  onClick={() => toggleDay(name)}
                >
                  <span className="workout-plan__day-short">{shortName}</span>
                  <span className="workout-plan__day-full">{name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="workout-plan__days" aria-label="Selected workouts">
          {weekDays.map(({ name }) => {
            const dayIndex = days.findIndex((day) => day.day === name);
            if (dayIndex === -1) return null;

            const day = days[dayIndex];
            const isExpanded = expandedDays.includes(name);
            const daySetCount = day.exercises.reduce(
              (total, exercise) => total + exercise.sets.length,
              0,
            );

            return (
              <article className="workout-day" key={name}>
                <div className="workout-day__header">
                  <span className="workout-day__badge">{name}</span>
                  {isExpanded ? (
                    <input
                      className="workout-plan__text-input workout-day__name"
                      aria-label={`${name} workout name`}
                      type="text"
                      value={day.workoutName}
                      onChange={(event) =>
                        updateDay(dayIndex, { workoutName: event.target.value })
                      }
                      minLength={2}
                      maxLength={100}
                      required
                    />
                  ) : (
                    <div className="workout-day__summary">
                      <strong>{day.workoutName}</strong>
                      <span>
                        {day.exercises.length}{" "}
                        {day.exercises.length === 1 ? "exercise" : "exercises"}
                        {" · "}
                        {daySetCount} {daySetCount === 1 ? "set" : "sets"}
                      </span>
                    </div>
                  )}
                  <div className="workout-day__actions">
                    <button
                      className="workout-plan__icon-button"
                      type="button"
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${name}`}
                      aria-expanded={isExpanded}
                      onClick={() => toggleExpandedDay(name)}
                    >
                      {isExpanded ? "−" : "+"}
                    </button>
                    <button
                      className="workout-plan__icon-button workout-plan__icon-button--danger"
                      type="button"
                      aria-label={`Remove ${name}`}
                      onClick={() => toggleDay(name)}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="workout-day__content">
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <section
                        className="workout-exercise"
                        key={`${name}-exercise-${exerciseIndex}`}
                        aria-label={`Exercise ${exerciseIndex + 1}`}
                      >
                        <div className="workout-exercise__header">
                          <input
                            className="workout-plan__text-input workout-exercise__name"
                            aria-label={`${name} exercise ${exerciseIndex + 1} name`}
                            type="text"
                            placeholder="Exercise name"
                            value={exercise.name}
                            onChange={(event) =>
                              updateExercise(dayIndex, exerciseIndex, {
                                name: event.target.value,
                              })
                            }
                            maxLength={100}
                            required
                          />
                          <div className="workout-exercise__unit" role="group" aria-label="Weight unit">
                            {["kg", "lbs"].map((unit) => (
                              <button
                                className={exercise.weightUnit === unit ? "is-active" : ""}
                                type="button"
                                key={unit}
                                aria-pressed={exercise.weightUnit === unit}
                                onClick={() =>
                                  updateExercise(dayIndex, exerciseIndex, { weightUnit: unit })
                                }
                              >
                                {unit}
                              </button>
                            ))}
                          </div>
                          <button
                            className="workout-plan__icon-button workout-plan__icon-button--danger"
                            type="button"
                            aria-label={`Remove ${exercise.name || "exercise"}`}
                            onClick={() => removeExercise(dayIndex, exerciseIndex)}
                          >
                            ×
                          </button>
                        </div>

                        <div className="workout-exercise__labels" aria-hidden="true">
                          <span>Set</span>
                          <span>Reps</span>
                          <span>Weight ({exercise.weightUnit})</span>
                          <span />
                        </div>
                        <div className="workout-exercise__sets">
                          {exercise.sets.map((set, setIndex) => (
                            <div
                              className="workout-exercise__set"
                              key={`${name}-${exerciseIndex}-${setIndex}`}
                            >
                              <span className="workout-exercise__set-number">{setIndex + 1}</span>
                              <input
                                className="workout-plan__text-input"
                                aria-label={`${exercise.name || "Exercise"} set ${setIndex + 1} reps`}
                                type="number"
                                min="1"
                                max="500"
                                value={set.reps}
                                onChange={(event) =>
                                  updateSet(dayIndex, exerciseIndex, setIndex, {
                                    reps: event.target.value,
                                  })
                                }
                                required
                              />
                              <input
                                className="workout-plan__text-input"
                                aria-label={`${exercise.name || "Exercise"} set ${setIndex + 1} weight`}
                                type="number"
                                min="0"
                                max="1000"
                                step="any"
                                value={set.weight}
                                onChange={(event) =>
                                  updateSet(dayIndex, exerciseIndex, setIndex, {
                                    weight: event.target.value,
                                  })
                                }
                                required
                              />
                              <button
                                className="workout-plan__icon-button workout-plan__icon-button--danger"
                                type="button"
                                aria-label={`Remove set ${setIndex + 1}`}
                                disabled={exercise.sets.length === 1}
                                onClick={() => removeSet(dayIndex, exerciseIndex, setIndex)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="workout-exercise__footer">
                          <button
                            className="workout-plan__text-button"
                            type="button"
                            onClick={() => addSet(dayIndex, exerciseIndex)}
                          >
                            + Add set
                          </button>
                          <span className="workout-exercise__set-count">
                            {exercise.sets.length} {exercise.sets.length === 1 ? "set" : "sets"} total
                          </span>
                        </div>
                      </section>
                    ))}

                    <button
                      className="workout-day__add-exercise"
                      type="button"
                      onClick={() => addExercise(dayIndex)}
                    >
                      + Add exercise
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <footer className="workout-plan__footer">
          <div className="workout-plan__totals" aria-live="polite">
            <strong>{days.length}</strong> {days.length === 1 ? "day" : "days"}
            <span>·</span>
            <strong>{totalExercises}</strong>{" "}
            {totalExercises === 1 ? "exercise" : "exercises"}
            <span>·</span>
            <strong>{totalSets}</strong> {totalSets === 1 ? "set" : "sets"}
          </div>
          <div className="workout-plan__footer-actions">
            {errorMessage && (
              <p className="workout-plan__message workout-plan__message--error" role="alert">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="workout-plan__message workout-plan__message--success" role="status">
                {successMessage}
              </p>
            )}
            <button
              className="workout-plan__button workout-plan__button--primary"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save plan"}
            </button>
          </div>
        </footer>
      </form>
    </main>
  );
};

export default WorkoutPlan;
