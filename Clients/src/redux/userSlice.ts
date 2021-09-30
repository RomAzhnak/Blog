import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	fetchAddUser, fetchLoginUser, fetchDelUser, fetchEditUser,
	fetchEditUserAdmin, fetchDelUserAdmin
} from '../api/userApi';
import { RootState } from './store';

export interface User {
	userName: string,
	email: string,
	urlAvatar: string,
	roleId: number,
	id: number,
	password: string,
};

export interface UserState {
	userFields: User,
	error: string,
	filter: string,
	userEditAdmin: User,
};

const initialState: UserState = {
	userFields: {
		userName: '',
		email: '',
		urlAvatar: '',
		roleId: 2,
		password: '',
		id: 0,
	},
	error: '',
	filter: '',
	userEditAdmin: {
		userName: '',
		email: '',
		urlAvatar: '',
		roleId: 2,
		password: '',
		id: 0,
	},
};

interface UserLogin {
	userName: string,
	email: string,
	roleId: number,
	urlAvatar: string,
	id: number,
	accessToken: string
}

export const fetchAdd = createAsyncThunk<string, User, { state: RootState }>(
	'user/fetchAdd',
	async (user, { rejectWithValue }) => {
		try {
			const resp = await fetchAddUser(user);
			return resp.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const fetchLogin = createAsyncThunk<UserLogin, User, { state: RootState }>(
	'user/fetchLogin',
	async (user, { rejectWithValue }) => {
		try {
			const resp = await fetchLoginUser(user);
			return resp.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const fetchEdit = createAsyncThunk<UserLogin, FormData, { state: RootState }>(
	'user/fetchEdit',
	async (user, { rejectWithValue }) => {
		try {
			const resp = await fetchEditUser(user);
			return resp.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const fetchEditAdmin = createAsyncThunk<UserLogin, FormData, { state: RootState }>(
	'user/fetchEditAdmin',
	async (user, { rejectWithValue }) => {
		try {
			const resp = await fetchEditUserAdmin(user);
			return resp.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const fetchDel = createAsyncThunk<UserLogin, User, { state: RootState }>(
	'user/fetchDel',
	async (user, { rejectWithValue }) => {
		try {
			const resp = await fetchDelUser(user);
			return resp.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const fetchDelAdmin = createAsyncThunk<UserLogin, User, { state: RootState }>(
	'user/fetchDelAdmin',
	async (user, { rejectWithValue }) => {
		try {
			const resp = await fetchDelUserAdmin(user);
			return resp.data
		} catch (err: any) {
			return rejectWithValue(err.response.data)
		}
	}
);

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		addUser: (state, action:PayloadAction<UserLogin>) => {
			state.userFields.email = action.payload.email;
			state.userFields.userName = action.payload.userName;
			state.userFields.roleId = action.payload.roleId;
			state.userFields.urlAvatar = action.payload.urlAvatar;
			state.userFields.id = action.payload.id;
		},
		postFilter: (state, action) => {
			state.filter = action.payload;
		},
		userEditAdmin: (state, action) => {
			state.userEditAdmin.email = action.payload.email;
			state.userEditAdmin.userName = action.payload.userName;
			state.userEditAdmin.roleId = action.payload.roleId;
			state.userEditAdmin.urlAvatar = action.payload.urlAvatar;
			state.userEditAdmin.id = action.payload.id;
			state.userEditAdmin.password = action.payload.password;
		},
		clearUser: (state) => {
			state.userFields.userName = '';
			state.userFields.email = '';
			state.userFields.roleId = 2;
			state.userFields.urlAvatar = '';
			state.userFields.id = 0;
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
				state.userFields.userName = action.payload.userName;
				state.userFields.roleId = action.payload.roleId;
				state.userFields.urlAvatar = action.payload.urlAvatar;
				state.userFields.id = action.payload.id;
				localStorage.setItem('token', action.payload.accessToken);
			})
			.addCase(fetchLogin.rejected, (state, action) => {
				state.error = 'error';
			})
			.addCase(fetchEdit.pending, (state, action) => {
			})
			.addCase(fetchEdit.fulfilled, (state, action) => {
				state.userFields.email = action.payload.email;
				state.userFields.userName = action.payload.userName;
				state.userFields.roleId = action.payload.roleId;
				state.userFields.urlAvatar = action.payload.urlAvatar;
				state.userFields.id = action.payload.id;
			})
			.addCase(fetchEdit.rejected, (state, action) => {
				state.error = 'error';
			})
			.addCase(fetchEditAdmin.pending, (state, action) => {
			})
			.addCase(fetchEditAdmin.fulfilled, (state, action) => {
				state.userEditAdmin.email = action.payload.email;
				state.userEditAdmin.userName = action.payload.userName;
				state.userEditAdmin.roleId = action.payload.roleId;
				state.userEditAdmin.urlAvatar = action.payload.urlAvatar;
				state.userEditAdmin.id = action.payload.id;
			})
			.addCase(fetchEditAdmin.rejected, (state, action) => {
				state.error = 'error';
			})
			.addCase(fetchDel.pending, (state, action) => {
			})
			.addCase(fetchDel.fulfilled, (state, action) => {
				state.userFields.email = '';
				state.userFields.userName = '';
				state.userFields.roleId = 2;
				state.userFields.urlAvatar = '';
				state.userFields.id = 0
			})
			.addCase(fetchDel.rejected, (state, action) => {
				state.error = 'error';
			})
			.addCase(fetchDelAdmin.pending, (state, action) => {
			})
			.addCase(fetchDelAdmin.fulfilled, (state, action) => {
				state.userEditAdmin.email = '';
				state.userEditAdmin.userName = '';
				state.userEditAdmin.roleId = 2;
				state.userEditAdmin.urlAvatar = '';
				state.userEditAdmin.id = 0
			})
			.addCase(fetchDelAdmin.rejected, (state, action) => {
				state.error = 'error';
			})
	}
});

export const {
	addUser,
	userEditAdmin,
	clearUser,
	postFilter
} = userSlice.actions;

export default userSlice.reducer;
