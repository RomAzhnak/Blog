import { createSlice } from '@reduxjs/toolkit';

// import { nanoid } from 'nanoid';
//todos: {task: 'task', id: new Date().getTime(), completed: false},

interface TodosState {
	firstName: string,
	lastName: string,
	email: string,
	password: string
}

const initialState: TodosState = {
	firstName: '',
	lastName: '',
	email: '',
	password: ''	
};

export const todoSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		addUser: (state, action) => {
				state.firstName = action.payload.firstName;
				state.lastName = action.payload.lastName;
				state.email = action.payload.email;
				state.password = action.payload.password

		},

		clearUser: (state, action) => {
				state.firstName = '';
				state.lastName = '';
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
// export const { visibilityFilter } = todoSlice.actions;
// export default todoSlice.reducer
