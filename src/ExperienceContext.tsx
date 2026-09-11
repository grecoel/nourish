import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ExperienceState = {
  activeLens: "severity" | "scale";
  selectedDistrictId?: string;
  comparisonDistrictId?: string;
  comparisonScenario?: { capacity: number; severityWeight: number };
  capacity: number;
  severityWeight: number;
};

const initial: ExperienceState = {
  activeLens: "severity",
  selectedDistrictId: "id-9120",
  comparisonDistrictId: "id-3201",
  capacity: 20,
  severityWeight: 0.8,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const restoreScenario = (value: unknown) => {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as { capacity?: number; severityWeight?: number };
  if (
    !Number.isFinite(candidate.capacity) ||
    !Number.isFinite(candidate.severityWeight)
  ) {
    return undefined;
  }
  return {
    capacity: clamp(Math.round(candidate.capacity!), 5, 50),
    severityWeight: clamp(candidate.severityWeight!, 0, 1),
  };
};

function restoreState(): ExperienceState {
  try {
    const stored = JSON.parse(
      localStorage.getItem("nourish-context") ?? "{}",
    ) as Partial<ExperienceState>;
    return {
      activeLens:
        stored.activeLens === "scale" || stored.activeLens === "severity"
          ? stored.activeLens
          : initial.activeLens,
      selectedDistrictId:
        typeof stored.selectedDistrictId === "string"
          ? stored.selectedDistrictId
          : initial.selectedDistrictId,
      comparisonDistrictId:
        typeof stored.comparisonDistrictId === "string"
          ? stored.comparisonDistrictId
          : initial.comparisonDistrictId,
      comparisonScenario: restoreScenario(stored.comparisonScenario),
      capacity: clamp(
        Math.round(
          Number.isFinite(stored.capacity) ? stored.capacity! : initial.capacity,
        ),
        5,
        50,
      ),
      severityWeight: clamp(
        Number.isFinite(stored.severityWeight)
          ? stored.severityWeight!
          : initial.severityWeight,
        0,
        1,
      ),
    };
  } catch {
    return initial;
  }
}

type Value = {
  state: ExperienceState;
  update: (patch: Partial<ExperienceState>) => void;
};

const Context = createContext<Value>({
  state: initial,
  update: () => undefined,
});

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExperienceState>(restoreState);
  useEffect(
    () => localStorage.setItem("nourish-context", JSON.stringify(state)),
    [state],
  );
  return (
    <Context.Provider
      value={{
        state,
        update: (patch) => setState((current) => ({ ...current, ...patch })),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useExperience = () => useContext(Context);
