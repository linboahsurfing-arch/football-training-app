import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Level = "beginner" | "intermediate" | "advanced";
type Goal = "control" | "fitness" | "shooting" | "weekly";
type History = Record<string, boolean>;

const DRILLS = {
  beginner: [
    { id: 1, name: "Ball Control - Cones", duration: 10, goal: "control", description: "Slow dribble through cones using both feet." },
    { id: 2, name: "Wall Passing", duration: 8, goal: "control", description: "Pass against a wall. Two touches max." },
    { id: 3, name: "Light Jog + Sprint", duration: 10, goal: "fitness", description: "Jog then sprint short distances." },
    { id: 4, name: "Target Shooting", duration: 10, goal: "shooting", description: "Aim for large target zones." }
  ],
  intermediate: [
    { id: 5, name: "First Touch Box", duration: 12, goal: "control", description: "Control and turn inside a marked box." },
    { id: 6, name: "One-Touch Passing", duration: 10, goal: "control", description: "One-touch passes against a wall." },
    { id: 7, name: "Sprint Intervals", duration: 15, goal: "fitness", description: "Sprint 20m, jog back. Repeat." },
    { id: 8, name: "Corner Shooting", duration: 12, goal: "shooting", description: "Aim for corners under light pressure." }
  ],
  advanced: [
    { id: 9, name: "Close Control Speed Dribble", duration: 15, goal: "control", description: "High-speed close control dribbling." },
    { id: 10, name: "Weak Foot Passing", duration: 10, goal: "control", description: "Pass using only weak foot." },
    { id: 11, name: "HIIT Football Runs", duration: 18, goal: "fitness", description: "High-intensity interval runs." },
    { id: 12, name: "One-Touch Finishing", duration: 15, goal: "shooting", description: "Finish first-time shots." }
  ]
};

const WEEKLY_PLAN = {
  beginner: [
    "Ball Control",
    "Fitness",
    "Shooting",
    "Ball Control",
    "Fitness",
    "Free Play",
    "Rest"
  ],
  intermediate: [
    "Ball Control",
    "Fitness",
    "Shooting",
    "Ball Control",
    "Fitness",
    "Match Play",
    "Recovery"
  ],
  advanced: [
    "Technical",
    "HIIT Fitness",
    "Finishing",
    "Technical",
    "Fitness",
    "Match Intensity",
    "Recovery"
  ]
};

export default function FootballTrainingApp() {
  const [level, setLevel] = useState<Level>("beginner");
  const [goal, setGoal] = useState<Goal>("control");
  const [completed, setCompleted] = useState<number[]>([]);
  const [history, setHistory] = useState<History>({});

  useEffect(() => {
    const saved = localStorage.getItem("trainingHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("trainingHistory", JSON.stringify(history));
  }, [history]);

  const drills = DRILLS[level].filter(d => goal === "weekly" || d.goal === goal);

  const toggleComplete = (id: number) => {
    setCompleted(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      const today = new Date().toISOString().slice(0, 10);
      setHistory(h => ({ ...h, [today]: true }));
      return updated;
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Football Training Planner</h1>

      <select className="border p-2 rounded" value={level} onChange={e => setLevel(e.target.value as Level)}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => setGoal("control")}>Control</Button>
        <Button onClick={() => setGoal("fitness")}>Fitness</Button>
        <Button onClick={() => setGoal("shooting")}>Shooting</Button>
        <Button onClick={() => setGoal("weekly")}>Weekly Plan</Button>
      </div>

      {goal === "weekly" ? (
        <Card>
          <CardContent className="space-y-2">
            <h2 className="font-semibold">Weekly Plan ({level})</h2>
            {WEEKLY_PLAN[level].map((d, i) => (
              <div key={i}>Day {i + 1}: {d}</div>
            ))}
          </CardContent>
        </Card>
      ) : (
        drills.map(drill => (
          <Card key={drill.id}>
            <CardContent className="space-y-2">
              <h2 className="font-semibold">{drill.name}</h2>
              <p className="text-sm">{drill.description}</p>
              <p className="text-xs">{drill.duration} minutes</p>
              <Button onClick={() => toggleComplete(drill.id)}>
                {completed.includes(drill.id) ? "Completed" : "Mark Complete"}
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
