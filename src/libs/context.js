import React, {createContext, useReducer} from 'react';

export const AppContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'TOKEN_AVAILABLE': {
      return {token: action.payload};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function AppContextProvider({children}) {
  const [state, dispatch] = useReducer(reducer, {token: null});
  const value = {state, dispatch};

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
