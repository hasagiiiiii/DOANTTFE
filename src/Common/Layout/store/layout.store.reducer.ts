import { createSlice } from "@reduxjs/toolkit";
interface LayoutState {
    data: [],
    test: string
}
const initState: LayoutState = {
    data: [],
    test: ''
}
export default createSlice({
    name: 'layout',
    initialState: initState,
    reducers: {
        setLayout(state, action) {
            state.data = action.payload;
        },
        test(state, action) {
            state.test = action.payload
        }
    }
})