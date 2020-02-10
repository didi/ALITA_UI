import { useEffect, useRef } from "react";

export type HOOKProps<T> = (value: T) => T;
export function usePrevious(value: Object): HOOKProps<Object> {
  const ref: { current: any } = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
