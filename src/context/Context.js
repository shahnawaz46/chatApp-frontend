import React, { createContext, useContext, useReducer } from 'react';
import reducer, { initialState } from './Reducer';

const Store = createContext()

const Context = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Store.Provider value={{ state, dispatch }} >
      {children}
    </Store.Provider>
  );
};

export default Context;

export const useStore = () => useContext(Store)
