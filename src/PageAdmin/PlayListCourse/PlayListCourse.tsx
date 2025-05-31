import React from 'react';
import Pic1 from '../../assets/pic-1.jpg';
import Thumb from '../../assets/post-1-1.png';

import './index.css';
import { Button, Card, message, Modal, Tabs } from 'antd';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import AddPlayList from '../AddPlayList/AddPlayList';
import getCookie from '../../Common/Function/Cookie';
import { fetchData } from '../../Hook/useFetch';
import PlayListVideo from '../../Common/Component/PlayListVideo';
import { FaUserPlus } from 'react-icons/fa';
import { CourseItem } from '../../Common/Component/Course/Course';
import { useDispatch, useSelector } from 'react-redux';
import { getPlayList } from './store/PlaylistAdmin.store.selector';
import PlaylistAdminStoreReducer, {
  PlayListItem,
} from './store/PlaylistAdmin.store.reducer';
import AddQuizzes from '../AddQuizzes/AddQuizzes';
import { FaVideo } from 'react-icons/fa';
import { CallVideoContextAPI } from '../../Context/CallVideoContext';
import { useNavigate } from 'react-router-dom';
import Quizzes from '../Quizzes/Quizzes';
import { getQuizzes } from '../Quizzes/store/Quizzes.store.selector';
import TabPane from 'antd/es/tabs/TabPane';
import AccountInList from '../../Common/Component/AcocuntInList';
import TableCommon from '../../Common/Component/Table/Table';
import UpdateLesson from '../UpdateLessson';
import { Result } from '../../Model/root.model';
import AddUserInCourse from '../AddUserInCourse';
import Score from '../Score/Score';

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

interface ListAccount {
  user_name: string;
  avatar: string;
}

const PlayListCourse = () => {
  // const [playlists, setPlaylists] = React.useState<PlayListVideo[]>([]);

  const [course, setCourse] = React.useState<CourseItem[]>([]);
  const [listAccount, setListAccount] = React.useState<ListAccount[]>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const idCourse = getCookie('idCourse');
  const playlists: PlayListItem[] = useSelector(getPlayList);
  const dispatch = useDispatch();
  React.useEffect(() => {
    fetchData(`${process.env.REACT_APP_URL_API_COURSES}getCourseByID`, 'POST', {
      idCourse,
    }).then((data) => setCourse(data.data));
  }, [idCourse]);
  React.useEffect(() => {
    fetchData(
      `${process.env.REACT_APP_URL_API_LESSON}/getPlayListbyID`,
      'POST',
      {
        idCourse,
      }
    ).then((data) =>
      dispatch(PlaylistAdminStoreReducer.actions.setPlayList(data.data))
    );

    fetchData(
      `${process.env.REACT_APP_URL_API_COURSES}/getAccountInCourse`,
      'POST',
      {
        idCourse,
      }
    ).then((data) => setListAccount(data.data));
  }, [idCourse]);
  const call = React.useContext(CallVideoContextAPI);
  const navigate = useNavigate();
  const handleNavigate = (idRoom: number) => {
    call?.handleJoinRoom(idRoom.toString());

    // navigate(`VideoCall/${nameRoom.trim()}`);
    navigate(`/VideoCall`);
  };
  const hanldeDBClick = (record: PlayListItem) => {
    document.cookie = `idLesson=${record.id};path=/`;
    navigate(`${record.title}`);
  };
  const handleRowClick = (record: PlayListItem) => {
    const update = ModalCommon.Show({
      title: <h1>Update Lesson</h1>,
      content: (
        <UpdateLesson
          dispatch={dispatch}
          onSucces={() => update.destroy()}
          values={record}
        />
      ),
      width: 800,
    });
  };
  const hanldeScore = () => {
    const scoreAll = ModalCommon.Show({
      title: <h1>Score</h1>,
      content: (
        <Score
          idCourse={idCourse}
          dispatch={dispatch}
          onSucces={() => scoreAll.destroy()}
        />
      ),
      width: 900,
    });
  };
  const hanldeOpenQuizzes = () => {
    const openQuiz = ModalCommon.Show({
      title: <h1>Quizzes</h1>,
      content: (
        <Quizzes
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
  const handleAddPlayList = () => {
    const addPlayList = ModalCommon.Show({
      title: <h1>Add Lesson</h1>,
      content: (
        <AddPlayList
          dispatch={dispatch}
          onSucces={() => addPlayList.destroy()}
          idCourse={idCourse}
        />
      ),
      width: 600,
    });
  };
  const AddUserInRoom = async () => {
    const addUser = ModalCommon.Show({
      title: <h1>Add User</h1>,
      content: (
        <AddUserInCourse
          dispatch={dispatch}
          onSucces={() => addUser.destroy()}
          idCourse={idCourse}
        />
      ),
      width: 400,
    });
  };
  const hanldeDeleteLesson = (record: PlayListItem) => {
    fetchData(`${process.env.REACT_APP_URL_API_LESSON}deleteLesson`, 'POST', {
      id: record.id,
    }).then((data) => {
      if (data.result === Result.RESULT_FALURE) {
        message.error('Thất bại', 1000);
      }
      if (data.result === Result.RESULT_SUCCESS) {
        message.success('Thành công', 1000);
        dispatch(
          PlaylistAdminStoreReducer.actions.deletePlayList(data.data.id)
        );
      }
    });
  };
  const columns = [
    // {
    //   title: 'STT',
    //   dataIndex: 'id',
    //   key: 'id',
    //   sorter: (a: { id: number }, b: { id: number }) => a.id - b.id, // ✅ Sắp xếp theo số
    // },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Banner',
      dataIndex: 'banner',
      key: 'banner',
      render: (img: string) => {
        return (
          <img
            width={40}
            height={40}
            src={`http://localhost:3001/uploads/${img}`}
            alt="icon"
          />
        );
      },
    },

    {
      title: 'created_at',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => {
        let da = new Date(date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        return <p>{da}</p>;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: PlayListItem) => (
        <div className="flex">
          <Button
            onClick={() => handleRowClick(record)}
            style={{ marginRight: 10 }}
          >
            Update
          </Button>
          <Button onClick={() => hanldeDeleteLesson(record)}>Delete</Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <h1 className="heading">Playlist Details</h1>
      <div className="flex" style={{ gap: '20px' }}>
        <section className="playlist-details">
          <Button
            onClick={() => handleNavigate(idCourse)}
            className="video btn"
          >
            <FaVideo size={20} />
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
                  <span>{course[0]?.created_at}</span>
                </div>
              </div>
              <div className="details">
                <h3>{course[0]?.title}</h3>
                <p>{course[0]?.description}</p>
                <Button
                  style={{ padding: '20px 40px', width: '300px' }}
                  className="btn"
                  onClick={() => setOpenModal(true)}
                >
                  Playlist
                </Button>
                <Button
                  style={{ padding: '20px 40px', width: '300px' }}
                  className="btn"
                  onClick={hanldeOpenQuizzes}
                >
                  Quizzes
                </Button>
                <Button
                  style={{ padding: '20px 40px', width: '300px' }}
                  className="btn"
                  onClick={hanldeScore}
                >
                  Score
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Card>
          <div
            className="line flex"
            style={{ justifyContent: 'space-between' }}
          >
            <h1>Thành Viên</h1>
            <div onClick={AddUserInRoom} className="addUser">
              <FaUserPlus size={20} />
            </div>
          </div>
          <div className="list-account">
            {listAccount?.map((acc, index) => {
              return (
                <AccountInList
                  name={acc.user_name}
                  img={acc.avatar}
                  key={index}
                />
              );
            })}
          </div>
        </Card>
      </div>
      <Modal
        title={<h1>PlayList</h1>}
        footer={null}
        width={1000}
        open={openModal}
        keyboard={true}
        onCancel={() => setOpenModal(false)}
      >
        <div style={{ padding: '10px 20px' }}>
          <Button onClick={handleAddPlayList}> Add PlayList</Button>
          <TableCommon
            onDBClick={hanldeDBClick}
            columns={columns}
            dataSource={playlists}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PlayListCourse;
