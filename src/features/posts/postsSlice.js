import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const BASE_URL = "https://b304203c-0525-4a6f-b6c1-7c59d32a26cc-00-d6bhwfg9bqzn.sisko.replit.dev";

export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser",
    async (userId) => {
        const response = await fetch(`${BASE_URL}/posts/user/${userId}`)
        return response.json(); //Action.payload in addCase
    }
)

export const savePost = createAsyncThunk(
    "posts/savePost",
    async (postContent) => {
        const token = localStorage.getItem("authToken");

        //Decode the token to fetch user id
        const decode = jwtDecode(token);
        const userId = decode.id // May change depending on how the server encode the token

        //Prepare data to be sent
        const data = {
        title: "Post Title",
        content: postContent,
        user_id: userId, 
        };
        const response = await axios.post(`${BASE_URL}/posts`, data)
        return response.data
    }
)

const postsSlice = createSlice({
    name:"posts",
    initialState: { posts: [], loading: true },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
            state.posts = action.payload
            state.loading = false
        }),
        builder.addCase(savePost.fulfilled, (state, action) => {
            state.posts = [action.payload, ...state.posts]
        })
    }
})

export default postsSlice.reducer