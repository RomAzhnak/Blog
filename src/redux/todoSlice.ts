import { createSlice } from '@reduxjs/toolkit';

interface TodosState {
	userName: string,
	// lastName: string,
	email: string,
	password: string
}

const initialState: TodosState = {
	userName: '',
	// lastName: '',
	email: '',
	password: ''	
};

export const todoSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		addUser: (state, action) => {
				state.userName = action.payload.userName;
				// state.lastName = action.payload.lastName;
				state.email = action.payload.email;
				state.password = action.payload.password

		},

		clearUser: (state, action) => {
				state.userName = '';
				// state.lastName = '';
				state.email = '';
				state.password = '';
		},
	},
});

export const {
	addUser,
	clearUser
} = todoSlice.actions;

export default todoSlice.reducer;
