import React from 'react';
import Pic1 from '../../assets/pic-1.jpg';
import Thumb from '../../assets/post-1-1.png';

import './index.css';
import { Button } from 'antd';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import getCookie from '../../Common/Function/Cookie';
import { fetchData } from '../../Hook/useFetch';
import PlayListVideo, {
  PlayListItem,
} from '../../Common/Component/PlayListVideo';
import { CourseItem } from '../../Common/Component/Course/Course';
import { useDispatch, useSelector } from 'react-redux';
import PlaylistStudentStoreReducer from './store/PlaylistStudent.store.reducer';
import { FaVideo } from 'react-icons/fa';
import { CallVideoContextAPI } from '../../Context/CallVideoContext';
import { useNavigate } from 'react-router-dom';
import { getPlayList } from './store/PlayListStudent.store.selector';
import QuizzesStudent from '../QuizzesStudent/QuizzesStudent';
// import Quizzes from '../Quizzes/Quizzes';
export interface PlayListVideo {
  id: number;
  title: string;
  content: string;
  video_url: string;
  order_index: number;
  created_at: string;
  course_id: number;
  banner: string;
}
const PlayListStudent = () => {
  // const [playlists, setPlaylists] = React.useState<PlayListVideo[]>([]);
  const [course, setCourse] = React.useState<CourseItem[]>([]);
  const idCourse = getCookie('idCourse');
  const playlists = useSelector(getPlayList);
  const dispatch = useDispatch();
  React.useEffect(() => {
    fetchData(`${process.env.REACT_APP_URL_API_COURSES}getCourseByID`, 'POST', {
      idCourse,
    }).then((data) => setCourse(data.data));
  }, []);
  React.useEffect(() => {
    fetchData(
      `${process.env.REACT_APP_URL_API_LESSON}/getPlayListbyID`,
      'POST',
      {
        idCourse,
      }
    ).then((data) =>
      dispatch(PlaylistStudentStoreReducer.actions.setPlayList(data.data))
    );
  }, []);
  const call = React.useContext(CallVideoContextAPI);
  const navigate = useNavigate();
  const handleNavigate = (idRoom: number) => {
    call?.handleJoinRoom(idRoom.toString());

    // navigate(`VideoCall/${nameRoom.trim()}`);
    navigate(`/VideoCall`);
  };
  const hanldeOpenQuizzes = () => {
    const openQuiz = ModalCommon.Show({
      title: <h1>Quizzes</h1>,
      content: (
        <QuizzesStudent
          dispatch={dispatch}
          onDestroy={() => openQuiz.destroy()}
          idCourse={idCourse}
          navigate={navigate}
        />
      ),
      width: 1500,
      afterClose: () => openQuiz.destroy(),
    });
  };

  return (
    <div>
      <h1 className="heading">Playlist Details</h1>
      <section className="playlist-details">
        <Button onClick={() => handleNavigate(idCourse)} className="video btn">
          <FaVideo size={30} />
        </Button>
        <Button onClick={() => hanldeOpenQuizzes()} className="quizzes btn">
          Quizzes
        </Button>
        <div className="row">
          <div className="column">
            {/* <form action="" method="post" className="save-playlist">
              <button type="submit">
                <i className="far fa-bookmark"></i> <span>save playlist</span>
              </button>
            </form> */}

            <div className="thumb">
              <img
                src={`${process.env.REACT_APP_UPP_LOAD}${course[0]?.thumbnail} `}
                alt=""
              />
              <span>{playlists.length} videos</span>
            </div>
          </div>
          <div className="column">
            <div className="tutor">
              <img
                src={`${process.env.REACT_APP_UPP_LOAD}${course[0]?.avatar}`}
                alt=""
              />
              <div>
                <h3>{course[0]?.user_name}</h3>
                <span>
                  {new Date(course[0]?.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="details">
              <h3>{course[0]?.title}</h3>
              <p>{course[0]?.description}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="playlist-videos">
        <h1 style={{ padding: '10px' }} className="heading">
          Playlist videos
        </h1>
        <div className="box-container">
          {playlists.map((playlist, index) => {
            return (
              <PlayListVideo
                id={playlist.id}
                link={playlist.title}
                title={playlist.title}
                image={playlist.banner}
                key={index}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PlayListStudent;
