import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AcountModel } from "../../../Model/root.model"

const iniState: {
    listAcount: AcountModel[],
} = {
    listAcount: []
}
export default createSlice({
    name: 'TeacherManager',
    initialState: iniState,
    reducers: {
        setAllUser: (state, action: PayloadAction<AcountModel[]>) => {
            state.listAcount = action.payload
        },
        addUser: (state, action: PayloadAction<AcountModel>) => {
            state.listAcount.push(action.payload)
        },
        updateAccount: (state, action: PayloadAction<AcountModel>) => {
            state.listAcount.map((item) => item.id === action.payload.id ? action.payload : item)
        },
        deleteAccount: (state, action: PayloadAction<number>) => {
            state.listAcount.filter(item => item.id !== action.payload)
        }
    }
})