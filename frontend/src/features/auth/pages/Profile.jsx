import "../profile.form.scss";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { registrationData, loading, handleRegister } = useAuth();

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      ...registrationData,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender,
      activityLevel,
      goal,
    });
    navigate("/");
  };

  if (loading) {
    return (
      <main>
        <h1>Loading.......</h1>
      </main>
    );
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className="profile-container">
        <div className="profile-heading">
          <h2 className="heading-text">Profile setup</h2>
          <p className="sub-text">
            Configure your baseline metrics for precision tracking.
          </p>
        </div>

        <div className="user-metric">
          <div className="age">
            <div className="sub-text" style={{ fontWeight: "600" }}>
              AGE
            </div>
            <input
              type="number"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
              }}
              placeholder="--"
            />
            <div className="sub-text">YRS</div>
          </div>

          <div className="weight">
            <div className="sub-text" style={{ fontWeight: "600" }}>
              WEIGHT
            </div>
            <input
              type="number"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
              }}
              placeholder="--"
            />
            <div className="sub-text">KG</div>
          </div>

          <div className="height">
            <div className="sub-text" style={{ fontWeight: "600" }}>
              HEIGHT
            </div>
            <input
              type="number"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
              }}
              placeholder="--"
            />
            <div className="sub-text">CM</div>
          </div>

          <div className="gender">
            <div className="sub-text" style={{ fontWeight: "600" }}>
              GENDER
            </div>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
              }}
              className="sub-text"
            >
              <option className="sub-text" value="Male">
                Male
              </option>
              <option className="sub-text" value="Female">
                Female
              </option>
              <option className="sub-text" value="Other">
                Other
              </option>
            </select>
          </div>
        </div>

        <div className="activity-level">
          <h3 className="heading-text">Activity level</h3>
          <div className="levels">
            <button type="button"
              onClick={() => setActivityLevel("sedentary")}
              className="activity-btn sub-text"
            >
              Sedentary
            </button>
            <button type="button"
              onClick={() => setActivityLevel("light")}
              className="activity-btn sub-text"
            >
              Light
            </button>
            <button type="button"
              onClick={() => setActivityLevel("moderate")}
              className="activity-btn sub-text"
            >
              Moderate
            </button>
            <button type="button"
              onClick={() => setActivityLevel("active")}
              className="activity-btn sub-text"
            >
              Active
            </button>
            <button type="button"
              onClick={() => setActivityLevel("extreme")}
              className="activity-btn sub-text"
            >
              Extreme
            </button>
          </div>
        </div>

        <div className="primary-objective">
          <h3 className="heading-text">Primary-objective</h3>
          <div className="goal">
            <button type="button" onClick={() => setGoal("bulk")} className="goal-btn">
              <h4 className="heading-text">Bulking</h4>
              <p className="sub-text">Max mass and strength</p>
            </button>
            <button type="button" onClick={() => setGoal("cut")} className="goal-btn">
              <h4 className="heading-text">Weight loss</h4>
              <p className="sub-text">Caloric deficit focus</p>
            </button>
            <button type="button" onClick={() => setGoal("muscle")} className="goal-btn">
              <h4 className="heading-text">Muscle gain</h4>
              <p className="sub-text">Lean hypertrophy</p>
            </button>
            <button type="button" onClick={() => setGoal("maintain")} className="goal-btn">
              <h4 className="heading-text">Maintain physique</h4>
              <p className="sub-text">Steady state</p>
            </button>
          </div>
        </div>

        <button type="submit" className="button primary-button" style={{ fontSize: "1rem" }}>
          Save Profile
        </button>
      </form>
    </main>
  );
};

export default Profile;
