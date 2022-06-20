import React, { useReducer } from 'react';
import { createContext, useContext } from 'react';
import { initialstate, reducer } from './Reducer';

const Store = createContext()


const Context = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialstate)

    return (
        <Store.Provider value={{ state, dispatch }}>
            {children}
        </Store.Provider>
    )
}

export default Context;

export const useStore = () => useContext(Store)