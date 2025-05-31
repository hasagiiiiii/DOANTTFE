import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface QuizzesItem {
    id: number
    title: string;
    description: string;
}
interface Quiz {
    quizzes: QuizzesItem[]
}
const initialState: Quiz = {
    quizzes: []
}
export default createSlice({
    name: 'Quiizzes',
    initialState,
    reducers: {
        getAllQuizzes(state, action: PayloadAction<QuizzesItem[]>) {
            state.quizzes = action.payload
        },
        insertQuizzes: (state, action: PayloadAction<QuizzesItem>) => {
            state.quizzes.push(action.payload)
        },
        updateQuizzes(state, action: PayloadAction<QuizzesItem>) {
            state.quizzes = state.quizzes.map((item) => item.id === action.payload.id ?
                action.payload : item)
        },
        deleteQuizzes(state, action: PayloadAction<{ id: number }>) {
            state.quizzes = state.quizzes.filter(item => item.id !== action.payload.id)
        }
    }
})