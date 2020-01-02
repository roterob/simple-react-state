import { useState, Dispatch } from "react";

export type SetPartialStateAction<S> =
  | Partial<S>
  | ((prevState: S) => Partial<S>);

export default function useObjectState<S extends object>(
  initState: S,
): [S, Dispatch<SetPartialStateAction<S>>] {
  const [state, setState] = useState(initState || {});

  const setObjectState = (newState: SetPartialStateAction<S>) => {
    setState(prev => ({
      ...prev,
      ...(typeof newState == "function"
        ? (newState as ((prevState: S) => Partial<S>))(prev)
        : (newState as Partial<S>)),
    }));
  };

  return [state, setObjectState];
}
