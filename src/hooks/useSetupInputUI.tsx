import { useCallback, useMemo, useRef, useState } from "react";

type InputType = "range";

interface BasicUI<U extends InputType, R> {
  type: U;
  label: string;
  defaultValue?: R;
}

interface InputRange extends BasicUI<"range", number> {
  min: number;
  max: number;
  step: number;
}

type InputUI = InputRange;

type UIConfig = Record<string, InputUI>;

type UIState<T extends UIConfig> = {
  [key in keyof T]: T[key]["defaultValue"];
};

function getInitialState<T extends UIConfig>(uiConfig: T): UIState<T> {
  return Object.keys(uiConfig).reduce((acc, name: keyof T) => {
    acc[name] = uiConfig[name].defaultValue;
    return acc;
  }, {} as UIState<T>);
}

export function useSetupInputUI<T extends UIConfig = UIConfig>(
  uiConfig: T,
  onChange?: (state: UIState<T>) => void,
) {
  const [uiState, setUIState] = useState(getInitialState(uiConfig));
  const syncUIState = useRef(uiState);

  const handleChange = useCallback(function <V>(id: keyof T, value: V) {
    setUIState((prev) => ({
      ...prev,
      [id]: value,
    }));
    syncUIState.current = { ...syncUIState.current, [id]: value };
    if (onChange) {
      onChange(syncUIState.current);
    }
  }, []);

  const UIView = useMemo(() => {
    return Object.keys(uiConfig).map((id) => {
      const ui = uiConfig[id];
      if (ui.type === "range") {
        return (
          <label key={id}>
            {ui.label}:
            <input
              type="range"
              min={ui.min}
              max={ui.max}
              step={ui.step}
              value={uiState[id]}
              onChange={(evt) => handleChange(id, +evt.target.value)}
            />
          </label>
        );
      }
      return null;
    });
  }, [uiConfig, uiState]);

  return {
    uiState,
    syncUIState,
    UIView,
    setUIState,
  };
}
