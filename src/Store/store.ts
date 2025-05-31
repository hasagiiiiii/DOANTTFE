import { configureStore } from "@reduxjs/toolkit";
import loginStoreReducer from "../Page/Login/store/login.store.reducer";
import roomStoreReducer from "./Room/room.store.reducer";
import createSagaMiddleware from "redux-saga";
import layoutStoreReducer from "../Common/Layout/store/layout.store.reducer";
import { rootSaga } from "./saga";
import CourseStoreReducer from "../PageAdmin/CoursesAdmin/store/Course.store.reducer";
import UpdateCourseStoreReducer from "../PageAdmin/UpdateCourse/store/UpdateCourse.store.reducer";
import PlaylistAdminStoreReducer from "../PageAdmin/PlayListCourse/store/PlaylistAdmin.store.reducer";
import QuizzesStoreReducer from "../PageAdmin/Quizzes/store/Quizzes.store.reducer";
import QuestionAdminStoreReducer from "../PageAdmin/Question/store/QuestionAdmin.store.reducer";
import PlaylistStudentStoreReducer from "../Page/PlayListStudent/store/PlaylistStudent.store.reducer";
import AccountManagerStore from "../PageAdmin/AccountManager/store/AccountManager.store";
import TeacherManagerStoreReducer from "../PageAdmin/TeacherManager/store/TeacherManager.store.reducer";
import LessonStoreReducer from "../PageAdmin/Lesson/store/Lesson.store.reducer";
const sagamiddleware = createSagaMiddleware()
const store = configureStore({
    reducer: {
        user: loginStoreReducer.reducer,
        room: roomStoreReducer.reducer,
        layout: layoutStoreReducer.reducer,
        courses: CourseStoreReducer.reducer,
        courseUpdate: UpdateCourseStoreReducer.reducer,
        playListAdmin: PlaylistAdminStoreReducer.reducer,
        payListStuden: PlaylistStudentStoreReducer.reducer,
        quizzes: QuizzesStoreReducer.reducer,
        questionAdmin: QuestionAdminStoreReducer.reducer,
        student: AccountManagerStore.reducer,
        teacher: TeacherManagerStoreReducer.reducer,
        lessonTeacher: LessonStoreReducer.reducer
    },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware({ thunk: false }).concat(sagamiddleware)
    }

})
sagamiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;