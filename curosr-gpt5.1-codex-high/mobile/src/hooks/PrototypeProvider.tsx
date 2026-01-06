import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import {
  familyMembers,
  familyMessages,
  habitTasks,
  medals as medalsSeed,
  planets as planetsSeed,
  routines,
  FamilyMessage,
  HabitTask,
  Planet,
  Medal,
  FamilyMember,
  Routine
} from "@/data/mockData";

type PrototypeContextValue = {
  tasks: HabitTask[];
  members: FamilyMember[];
  messages: FamilyMessage[];
  planets: Planet[];
  medals: Medal[];
  routines: Routine[];
  lightPoints: number;
  flightProgress: number;
  toggleTaskStatus: (id: string) => void;
  applaudMessage: (id: string) => void;
  boostPlanet: (id: string) => void;
  advanceMedal: (id: string, delta?: number) => void;
};

const PrototypeContext = createContext<PrototypeContextValue | undefined>(undefined);

const cycleStatus = (status: HabitTask["status"]): HabitTask["status"] => {
  if (status === "pending") return "in-progress";
  if (status === "in-progress") return "done";
  return "pending";
};

export const PrototypeProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState(habitTasks);
  const [members, setMembers] = useState(familyMembers);
  const [messages, setMessages] = useState(familyMessages);
  const [planets, setPlanets] = useState(planetsSeed);
  const [medals, setMedals] = useState(medalsSeed);
  const [lightPoints, setLightPoints] = useState(248);
  const [flightProgress, setFlightProgress] = useState(0.42);

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) => {
      let mutated = false;
      const next = prev.map((task) => {
        if (task.id !== id) return task;
        const nextStatus = cycleStatus(task.status);
        if (task.status !== "done" && nextStatus === "done") {
          awardPoints(task.points, task.members, 1);
          mutated = true;
        }
        if (task.status === "done" && nextStatus !== "done") {
          awardPoints(-task.points, task.members, -1);
          mutated = true;
        }
        return { ...task, status: nextStatus };
      });
      if (mutated) {
        const doneCount = next.filter((task) => task.status === "done").length;
        const ratio = next.length ? doneCount / next.length : 0;
        setFlightProgress((prevProgress) => {
          if (ratio === 0) return Math.max(0.05, prevProgress - 0.1);
          return Math.max(prevProgress, Math.min(1, ratio + 0.05));
        });
      }
      return next;
    });
  };

  const awardPoints = (delta: number, memberIds: string[], streakDelta: number) => {
    setMembers((prev) =>
      prev.map((member) => {
        if (!memberIds.includes(member.id)) return member;
        return {
          ...member,
          points: Math.max(0, member.points + delta),
          streak: Math.max(0, member.streak + streakDelta)
        };
      })
    );
    setLightPoints((prev) => Math.max(0, prev + delta));
  };

  const applaudMessage = (id: string) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === id ? { ...message, likes: message.likes + 1 } : message))
    );
  };

  const boostPlanet = (id: string) => {
    setPlanets((prev) =>
      prev.map((planet) => {
        if (planet.id !== id) return planet;
        const increment = planet.status === "locked" ? 0.05 : 0.12;
        return { ...planet, progress: Math.min(1, planet.progress + increment) };
      })
    );
  };

  const advanceMedal = (id: string, delta = 0.12) => {
    setMedals((prev) =>
      prev.map((medal) => {
        if (medal.id !== id) return medal;
        return { ...medal, progress: Math.min(1, medal.progress + delta) };
      })
    );
  };

  const value = useMemo(
    () => ({
      tasks,
      members,
      messages,
      planets,
      medals,
      routines,
      lightPoints,
      flightProgress,
      toggleTaskStatus,
      applaudMessage,
      boostPlanet,
      advanceMedal
    }),
    [tasks, members, messages, planets, medals, lightPoints, flightProgress]
  );

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
};

export const usePrototype = () => {
  const ctx = useContext(PrototypeContext);
  if (!ctx) throw new Error("usePrototype must be used within PrototypeProvider");
  return ctx;
};

