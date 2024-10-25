import { useCallback, useMemo, useRef, useState } from "react";

type InputType = "range" | "select";

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

interface InputSelect extends BasicUI<"select", string | string[]> {
  multiple?: boolean;
  size?: number;
  options: Array<{ label: string; value: string }>;
}

type InputUI = InputRange | InputSelect;

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

  const renderUI = (id: string, ui: InputUI) => {
    if (ui.type === "range") {
      return (
        <input
          type="range"
          min={ui.min}
          max={ui.max}
          step={ui.step}
          value={uiState[id]}
          onChange={(evt) => handleChange(id, +evt.target.value)}
        />
      );
    }
    if (ui.type === "select") {
      return (
        <select
          value={uiState[id]}
          size={ui.size || 12}
          multiple={ui.multiple}
          onChange={(evt) => {
            const value = evt.target.value;
            if (ui.multiple) {
              const set = new Set(uiState[id] as string[]);
              if (set.has(value)) {
                set.delete(value);
              } else {
                set.add(value);
              }
              handleChange(id, [...set]);
            } else {
              handleChange(id, value);
            }
          }}
        >
          {ui.options.map((opt) => {
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
      );
    }
    return null;
  };

  const UIView = useMemo(() => {
    return Object.keys(uiConfig).map((id) => {
      const ui = uiConfig[id];
      if (ui) {
        return (
          <label key={id}>
            {ui.label}: {renderUI(id, ui)}
          </label>
        );
      }
    });
  }, [uiConfig, uiState]);

  return {
    uiState,
    syncUIState,
    UIView,
    setUIState,
  };
}
