import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlayListItem {
    id: number;
    title: string;
    content: string;
    course_id: number
    video_url: string
    order_index: number
    banner: string
    create_at: string
}
interface PlayListState {
    playList: PlayListItem[];
}
const initialState: PlayListState = {
    playList: []
}
export default createSlice({
    name: "playListAdmin",
    initialState: initialState,
    reducers: {
        setPlayList(state, action: PayloadAction<PlayListItem[]>) {
            state.playList = action.payload;
        },
        insert(state, action: PayloadAction<PlayListItem>) {
            state.playList.push(action.payload)
        },
        upatePlayList(state, action: PayloadAction<PlayListItem>) {

            state.playList = state.playList.map(item => {
                return item.id === action.payload.id ? action.payload : item
            })
        },
        deletePlayList(state, action: PayloadAction<number>) {
            state.playList = state.playList.filter(item => item.id !== action.payload)
        }

    }
})