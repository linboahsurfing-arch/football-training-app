import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DRILLS = [
  {
    id: 1,
    name: "Ball Control – Cones",
    category: "Technical",
    duration: 10,
    description: "Dribble through cones using both feet. Focus on close control.",
    goal: "control"
  },
  {
    id: 2,
    name: "Passing Against Wall",
    category: "Technical",
    duration: 8,
    description: "Pass against a wall using inside of foot. Alternate feet.",
    goal: "control"
  },
  {
    id: 3,
    name: "Sprint Intervals",
    category: "Fitness",
    duration: 12,
    description: "Sprint 20m, jog back. Repeat 6 times.",
    goal: "fitness"
  },
  {
    id: 4,
    name: "Shooting Accuracy",
    category: "Shooting",
    duration: 10,
    description: "Aim for corners. 20 shots total.",
    goal: "shooting"
  }
];

export default function FootballTrainingApp() {
  /* ------------------ helpers ------------------ */
  const calculateStreak = (hist) => {
    let streak = 0;
    let day = new Date();
    while (true) {
      const key = day.toISOString().slice(0, 10);
      if (hist[key]) {
        streak++;
        day.setDate(day.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const countThisWeek = (hist) => {
    const now = new Date();
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      if (hist[d.toISOString().slice(0, 10)]) count++;
    }
    return count;
  };

  /* ------------------ state ------------------ */
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("playerProfile");
    return saved
      ? JSON.parse(saved)
      : { age: "teen", level: "beginner", position: "any" };
  });

  const [goal, setGoal] = useState("control");
  const [completed, setCompleted] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("trainingHistory");
    return saved ? JSON.parse(saved) : {};
  });

  /* ------------------ persistence ------------------ */
  useEffect(() => {
    localStorage.setItem("playerProfile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("trainingHistory", JSON.stringify(history));
  }, [history]);

  /* ------------------ AI routine (step 5) ------------------ */
  const generateAIRoutine = () => {
    const base = DRILLS.filter((d) => d.goal === goal);

    return base.map((d) => ({
      ...d,
      duration:
        profile.level === "beginner"
          ? Math.max(5, d.duration - 3)
          : profile.level === "advanced"
          ? d.duration + 5
          : d.duration,
      description: `${d.description} (${profile.position} focus)`
    }));
  };

  const todaysDrills = generateAIRoutine();

  /* ------------------ actions ------------------ */
  const toggleComplete = (id) => {
    setCompleted((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((d) => d !== id)
        : [...prev, id];

      const today = new Date().toISOString().slice(0, 10);
      setHistory((h) => ({
        ...h,
        [today]: updated.length === todaysDrills.length
      }));

      return updated;
    });
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <h1 className="text-3xl font-extrabold tracking-tight">? Daily Football Training</h1>
      <p className="text-gray-400 text-sm">
        Profile: {profile.age} • {profile.level} • {profile.position}
      </p>

      <p className="text-gray-500">Choose your profile</p>
      <div className="grid grid-cols-3 gap-2">
        <select
          className="border rounded p-2"
          value={profile.age}
          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
        >
          <option value="youth">Youth</option>
          <option value="teen">Teen</option>
          <option value="adult">Adult</option>
        </select>
        <select
          className="border rounded p-2"
          value={profile.level}
          onChange={(e) => setProfile({ ...profile, level: e.target.value })}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select
          className="border rounded p-2"
          value={profile.position}
          onChange={(e) => setProfile({ ...profile, position: e.target.value })}
        >
          <option value="any">Any Position</option>
          <option value="defender">Defender</option>
          <option value="midfielder">Midfielder</option>
          <option value="forward">Forward</option>
        </select>
      </div>

      <p className="text-gray-500">Choose your focus for today</p>
      <div className="flex gap-2 flex-wrap">
        <Button variant={goal === "control" ? "default" : "secondary"} onClick={() => setGoal("control")}>
          Ball Control
        </Button>
        <Button variant={goal === "fitness" ? "default" : "secondary"} onClick={() => setGoal("fitness")}>
          Fitness
        </Button>
        <Button variant={goal === "shooting" ? "default" : "secondary"} onClick={() => setGoal("shooting")}>
          Shooting
        </Button>
      </div>

      {todaysDrills.map((drill) => (
        <Card key={drill.id} className="rounded-2xl shadow hover:shadow-lg transition-shadow">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{drill.name}</h2>
              <span className="text-sm text-gray-400">{drill.duration} min</span>
            </div>
            <p className="text-sm text-gray-600">{drill.description}</p>
            <Button
              onClick={() => toggleComplete(drill.id)}
              className="mt-2 w-full"
              variant={completed.includes(drill.id) ? "secondary" : "default"}
            >
              {completed.includes(drill.id) ? "Completed ?" : "Mark Complete"}
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="border-t pt-4 space-y-2 bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold">?? Progress</h2>
        <p className="text-sm text-gray-600">?? Streak: {calculateStreak(history)} days</p>
        <p className="text-sm text-gray-600">? Days trained this week: {countThisWeek(history)}</p>
      </div>

      <div className="text-sm text-gray-500 pt-2">
        Completed {completed.length} / {todaysDrills.length} drills today
      </div>
    </div>
  );
}
