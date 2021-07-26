import { useEffect, useReducer, useState } from "react";

const actionTypes = {
  fetchData: "FETCH_INIT",
  fetchDataSucceed: "FETCH_SUCCEED",
  fetchDataFailed: "FETCH_FAILED",
};

interface ActionWithPayload<T> {
  type: string;
  payload?: T[];
}

interface State<T> {
  isLoading: boolean;
  isError: boolean;
  data: T[];
}

const createDataFetchReducer =
  <T>() =>
  (state: State<T>, action: ActionWithPayload<T>): State<T> => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "FETCH_SUCCEED":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: state.data.concat(action.payload || []),
        };
      case "FETCH_FAILED":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };

function useDataFetcher<T>(
  fetchMethod: () => Promise<T[]>,
  initialData: T[]
): [State<T>, () => void] {
  const reducer = createDataFetchReducer<T>();
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  const [fetchCount, setFetchCount] = useState(0);

  const loadMore = () => {
    setFetchCount((count) => count + 1);
  };
  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: actionTypes.fetchData });

      try {
        const result = await fetchMethod();

        if (!didCancel) {
          dispatch({ type: actionTypes.fetchDataSucceed, payload: result });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: actionTypes.fetchDataFailed });
        }
      }
    };

    fetchData();
    return () => {
      didCancel = true;
    };
  }, [fetchMethod, fetchCount]);
  return [state, loadMore];
}

export default useDataFetcher;
