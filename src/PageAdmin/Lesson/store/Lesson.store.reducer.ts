import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface LessonItem {
    id: number
    video_url: string;
    title: string;
    role: string;
    user_name: string;
    content: string;
    created_at: string;
    avatar: string;
}
interface ListLesson {
    listLessons: LessonItem
}
const initialState: ListLesson = {
    listLessons: {
        id: 0,
        avatar: '',
        created_at: '',
        content: '',
        role: '',
        title: '',
        user_name: '',
        video_url: ''
    }
}
export default createSlice({
    name: "playListAdmin",
    initialState: initialState,
    reducers: {
        setPlayList(state, action: PayloadAction<LessonItem>) {
            state.listLessons = action.payload;
        },
        insert(state, action: PayloadAction<LessonItem>) {
            state.listLessons = {
                id: action.payload.id,
                title: action.payload.title,
                user_name: action.payload.user_name,
                avatar: action.payload.avatar,
                created_at: action.payload.created_at,
                content: action.payload.content,
                role: action.payload.role,
                video_url: action.payload.video_url
            }
        },
        upateLessson(state, action: PayloadAction<LessonItem>) {
            state.listLessons = {
                id: action.payload.id,
                title: action.payload.title,
                user_name: action.payload.user_name,
                avatar: action.payload.avatar,
                created_at: action.payload.created_at,
                content: action.payload.content,
                role: action.payload.role,
                video_url: action.payload.video_url
            }
        }

    }
})