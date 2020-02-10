import { useEffect, useRef } from 'react'

export interface HOOKProps<T>{
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    (value: T): T
}
export default function usePrevious(value: Object):HOOKProps<Object> {
  const ref:{ current : any } = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}