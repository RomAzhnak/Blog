import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAddUser, fetchLoginUser, fetchDelUser, fetchEditUser } from '../api/userApi';
import { RootState } from './store';

export interface User {
	userName: string,
	email: string,
	// urlAvatar: string,
	password: string
};
export interface UserState {
	userFields: User,
	error: string
};

const initialState: UserState = {
	userFields: {
		userName: '',
		email: '',
		// urlAvatar: '',
		password: ''
	},
	error: ''
};

interface UserLogin {
	username: string,
	email: string,
	accessToken: string
}

export const fetchAdd = createAsyncThunk<string, User, { state: RootState }>(
	'user/fetchAdd',
	async (user, thankApi) => {
		const resp = await fetchAddUser(user);
		return resp.data
	}
);

export const fetchLogin = createAsyncThunk<UserLogin, User, { state: RootState }>(
	'user/fetchLogin',
	async (user, thankApi) => {
		const resp = await fetchLoginUser(user);
		return resp.data
	}
);

export const fetchEdit = createAsyncThunk<UserLogin, User, { state: RootState }>(
	'user/fetchEdit',
	async (user, thankApi) => {
		const resp = await fetchEditUser(user);
		return resp.data
	}
);

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		addUser: (state, action) => {
			state.userFields = action.payload;

		},
		clearUser: (state) => {
			
			// fetchDelUser(state.userFields.email);
			fetchDelUser({email: 'aaa@gmail.com'});
			state.userFields.userName = '';
			state.userFields.email = '';
			state.userFields.password = '';
		},
	}
	,
	extraReducers: (builder) => {
		builder
			.addCase(fetchAdd.pending, (state, action) => {
			})
			.addCase(fetchAdd.fulfilled, (state, action) => {
				state.error = action.payload;
			})
			.addCase(fetchAdd.rejected, (state, action) => {
				state.error = 'error';
			})
			.addCase(fetchLogin.pending, (state, action) => {

			})
			.addCase(fetchLogin.fulfilled, (state, action) => {
				state.userFields.email = action.payload.email;
				state.userFields.userName = action.payload.username;
				localStorage.setItem('token', action.payload.accessToken);
			})
			.addCase(fetchLogin.rejected, (state, action) => {
				state.error = 'error';
			})
			.addCase(fetchEdit.pending, (state, action) => {
			})
			.addCase(fetchEdit.fulfilled, (state, action) => {
				state.userFields.email = action.payload.email;
				state.userFields.userName = action.payload.username;
			})
			.addCase(fetchEdit.rejected, (state, action) => {
				state.error = 'error';
			})
	}

	// ,
	// extraReducers: (builder) => {
	// 	builder.addCase(fetchUserById.pending, (state, action) => {
	// 		state.loading = true
	// 	});
	// 	builder.addCase(fetchUserById.fulfilled, (state, action) => {
	// 		state.loading = false;
	// 		state.user = action.payload
	// 	});
	// 	builder.addCase(fetchUserById.rejected, (state, action) => {
	// 		state.error = 
	// 	});
	// }
});


// const getUserThunk = (id: number) => async (dispatch: any) => {
// 	try {
// 		dispatch({
// 			type: 'START_LOADING'
// 		});
// 		await dispatch(newThunk())
// 		const user = await getUser(id);
// 		dispatch(addUser(user))
// 	} catch (e) {
// 		dispatch({
// 			type: "SET_ERROR",
// 			err: e.message
// 		})
// 	} finally {
// 		dispatch({
// 			type: 'STOP_LOADING'
// 		})
// 	}
// }

export const {
	addUser,
	clearUser
} = userSlice.actions;

export default userSlice.reducer;
