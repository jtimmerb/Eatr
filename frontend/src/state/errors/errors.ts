import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v4} from 'uuid';

export interface Error {
    id: string;
    message: string;
    redirect?: string;
}

export interface State {
    list?: Error[];
}

// ErrorSlice defines an application-wide store of errors.
const errorSlice = createSlice({
    name: 'errors',
    initialState: {} as State,
    reducers: {
        // Reset the list of errors
        reset: state => {
            state.list = [];
        },
        // Append a new error to the list
        add: (state, action: PayloadAction<{message: string; redirect?: string}>) => {
            if (state.list === undefined) state.list = [];

            const err: Error = {id: v4(), message: action.payload.message, redirect: action.payload.redirect }
            state.list = [...state.list, err]
        },
        // Remove an error from the list
        del: (state, action: PayloadAction<string>) => {
            if (state.list === undefined) state.list = [];

            state.list = state.list.filter(err => err.id !== action.payload)
        }
        
    }
})

export const {reset, add, del} = errorSlice.actions;

export default errorSlice.reducer;