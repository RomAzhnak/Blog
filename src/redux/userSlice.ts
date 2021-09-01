import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAddUser } from '../api/userApi';

interface User {
	userName: string,
		email: string,
		password: string
};
interface UserState {
	user: User,
	error: string
}

const initialState: UserState = {
	user: {
		userName: '',
		email: '',
		password: ''
	},
	error: ''
};

export const fetchAdd = createAsyncThunk(
	'user/fetchAdd',
	async (user: User) => {
		const resp = await fetchAddUser(user)
		return resp.data
	}
)

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		addUser: (state, action) => {
			state.user = action.payload;

		},
		clearUser: (state, action) => {
			state.user.userName = '';
			state.user.email = '';
			state.user.password = '';
		},
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder
			.addCase(fetchAdd.fulfilled, (state, action) => {
				// Add user to the state array
				state.user = action.payload.data
			})
			.addCase(fetchAdd.rejected, (state, action) => {
				// Add user to the state array
				state.error = 'error';

			})
	},
});

export const {
	addUser,
	clearUser
} = userSlice.actions;

export default userSlice.reducer;
