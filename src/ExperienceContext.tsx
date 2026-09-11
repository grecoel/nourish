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
  capacity: number;
  severityWeight: number;
};

const initial: ExperienceState = {
  activeLens: "severity",
  capacity: 20,
  severityWeight: 0.8,
  comparisonDistrictId: "id-9120",
};

type Value = {
  state: ExperienceState;
  update: (patch: Partial<ExperienceState>) => void;
};

const Context = createContext<Value>({
  state: initial,
  update: () => undefined,
});

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExperienceState>(() => {
    try {
      return {
        ...initial,
        ...JSON.parse(localStorage.getItem("nourish-context") ?? "{}"),
      };
    } catch {
      return initial;
    }
  });
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
