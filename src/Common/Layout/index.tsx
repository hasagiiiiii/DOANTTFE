import React, { useContext, useState } from 'react';
import { Breadcrumb, Layout, Spin, theme } from 'antd';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import './index.css';
import { AppContextAPI } from '../../Context/AppContext';
import { BreadCumpItem } from '../../Model/root.model';
import getCookie from '../Function/Cookie';
import { GetAddRoomModel } from '../../Page/AddRoom/store/addRoom.model';
import { CallVideoContextAPI } from '../../Context/CallVideoContext';
import { useDispatch } from 'react-redux';
import roomStoreReducer from '../../Store/Room/room.store.reducer';
import { io, Socket } from 'socket.io-client';
import ModalCommon from '../Component/Modal/Modal.component';
import Register from '../../Page/Register/Register';
import Login from '../../Page/Login/Login';
import Home from '../../Page/Home/Home';
import pic1 from '../../assets/pic-1.jpg';
import { IoMdHome, IoMdSearch } from 'react-icons/io';
import { FaGraduationCap, FaQuestion, FaSun, FaUser } from 'react-icons/fa';
import { FaPersonChalkboard } from 'react-icons/fa6';
import { MdContactMail, MdMenu } from 'react-icons/md';
import NotFound from '../../Page/NotFound/NotFound';
import CoursesAdmin from '../../PageAdmin/CoursesAdmin/CoursesAdmin';
import Course from '../Component/Course/Course';
import HomeAdmin from '../../PageAdmin/HomeAdmin/HomeAdmin';
import PlayListCourse from '../../PageAdmin/PlayListCourse/PlayListCourse';
import { getLocalStorage } from '../Function/LocalStorage';
import LessonAdmin from '../../PageAdmin/Lesson';
import About from '../../Page/About/About';
import Teacher from '../../Page/Teacher/Teacher';
import Contact from '../../Page/Contact/Contact';
import Profile, { ProfileModel } from '../../Page/Profile/Profile';
import { fetchData } from '../../Hook/useFetch';
import VideoCall from '../../Page/VideoCall';
import Question from '../../PageAdmin/Question/Question';
import axios from 'axios';
import Courses from '../../Page/Courses/Courses';
import PlayListStudent from '../../Page/PlayListStudent/PlayListStudent';
import LessonStudent from '../../Page/LessonStudent/LessonStudent';
import QuestionStudent from '../../Page/QuestionStudent/QuestionStudent';
import AccountManager from '../../PageAdmin/AccountManager';
import TeacherManager from '../../PageAdmin/TeacherManager';
import VsCode from '../../PageAdmin/VSCode';

const { Header, Sider, Content } = Layout;
const LayoutCommon: React.FC = () => {
  const { setLogin, Logout, spin, setSpin } = React.useContext(AppContextAPI);
  const call = useContext(CallVideoContextAPI);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [breadCump, setBreadCump] = useState<BreadCumpItem[]>([]);
  const [user, setUser] = useState<any>();
  const [active, setActive] = useState<boolean>(false);
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setProFile] = React.useState<ProfileModel>();
  const dispatch = useDispatch();
  React.useEffect(() => {
    setUser(JSON.parse(getCookie('user')));
    // fetchData(`${process.env.REACT_APP_URL_API}profile`, 'GET').then((data) =>
    //   setProFile(data.data)
    // );
    axios
      .get(`${process.env.REACT_APP_URL_API_USER}profile`, {
        withCredentials: true,
      })
      .then((data) => {
        if (data.data.result === 0) {
          setProFile(data.data.data);
        }
      });
  }, []);
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Nếu scroll > 50px thì thêm class
      } else {
        setIsScrolled(false);
      }
    };
    document.addEventListener('scroll', handleScroll);
    setBreadCump(() => {
      return location.pathname.split('/').map((item, index) => {
        if (index === 0) {
          return { title: <Link to="">Home</Link> };
        } else {
          return { title: decodeURIComponent(item) };
        }
      });
    });
    return () => document.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  const handleMouseDown = (e: MouseEvent) => {
    console.log(!(e.target as HTMLElement).closest('#profile'));
    if (!(e.target as HTMLElement).closest('#profile')) {
      setActive(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);

    // Cleanup
    return () => {
      setTimeout(
        () => document.removeEventListener('mousedown', handleMouseDown),
        1000
      );
    };
  }, [active]);
  // useEffect(() => {
  //   const newSocket = io('http://localhost:3001/', {
  //     // connect to socket Server
  //     transports: ['websocket'],
  //   });
  //   setSocket(newSocket);

  //   newSocket.on('connect', () => {
  //     console.log('Socket connected:', newSocket.id); // Xác nhận kết nối thành công
  //   });
  //   newSocket.on('pushUser', (data) => {
  //     if (data.idaccount == idAcount) {
  //       setListRoom((pre) => [...pre, data]);
  //     }
  //   });
  //   newSocket.on('disconnect', () => {
  //     console.log('Socket disconnected');
  //   });
  //   setSocket(newSocket);
  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  const handleRegister = () => {
    const RegisterModal = ModalCommon.Show({
      content: <Register onSucces={() => RegisterModal.destroy()} />,
      title: <h1>Register</h1>,
      width: 800,
    });
  };
  const hanldeLogin = () => {
    const LoginModal = ModalCommon.Show({
      content: (
        <Login
          setLogin={setLogin}
          setSpin={setSpin}
          onSucces={() => LoginModal.destroy()}
          setUser={setUser}
        />
      ),
      title: <h1>Login</h1>,
      width: 1000,
      afterClose: () => {},
    });
  };
  const handleNavigate = (url: string, idRoom: number, nameRoom: string) => {
    if (url === '/VideoCall') {
      call?.handleJoinRoom(idRoom.toString());
    }
    if (url === '/Chat') {
      socket?.emit('joinRoomChat', { roomId: idRoom });
    }
    dispatch(roomStoreReducer.actions.addRoom(idRoom));
    navigate(`${url}/${nameRoom.trim()}`);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout hasSider={true}>
      <Sider className="sider" trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <div className="profile">
          <img
            src={
              profile
                ? `${process.env.REACT_APP_UPP_LOAD}${profile.avatar}`
                : pic1
            }
            className="image"
            alt=""
          />
          <h3 className="name">{profile ? profile.user_name : ''}</h3>
          <p className="role">{user?.role}</p>
          <Link to="/Profile" className="btn">
            view profile
          </Link>
        </div>

        {user?.role !== 'admin' ? (
          <nav className="navbar">
            <Link to="/">
              <div className="flex">
                <IoMdHome size={25} />
                <span>Home</span>
              </div>
            </Link>
            <Link to="/About">
              <div className="flex">
                <FaQuestion size={25} />
                <span>About</span>
              </div>
            </Link>
            <Link to="/courses">
              <div className="flex">
                <FaGraduationCap size={25} />
                <span>Courses</span>
              </div>
            </Link>
            <Link to="/Teachers">
              <div className="flex">
                <FaPersonChalkboard size={25} />
                <span>Teachers</span>
              </div>
            </Link>
            <Link to="/Contact">
              <div className="flex">
                <MdContactMail size={25} />
                <span>Contact us</span>
              </div>
            </Link>
          </nav>
        ) : (
          <nav className="navbar">
            <Link to="/">
              <div className="flex">
                <IoMdHome size={25} />
                <span>Home</span>
              </div>
            </Link>
            <Link to="/About">
              <div className="flex">
                <FaQuestion size={25} />
                <span>About</span>
              </div>
            </Link>
            <Link to="/Teachers">
              <div className="flex">
                <FaPersonChalkboard size={25} />
                <span>Teachers</span>
              </div>
            </Link>
            <Link to="/Students">
              <div className="flex">
                <FaGraduationCap size={25} />
                <span>Students</span>
              </div>
            </Link>
          </nav>
        )}
      </Sider>
      <Layout>
        <Header className={`${isScrolled ? 'scroll' : ''} header`}>
          <section className="flex">
            <a href="home.html" className="logo">
              Educa.
            </a>

            <form action="search.html" method="post" className="search-form">
              <input
                type="text"
                name="search_box"
                required
                placeholder="search courses..."
                maxLength={100}
              />
              <button type="submit">
                <IoMdSearch />
              </button>
            </form>

            {user ? (
              <div className="icons flex">
                <div>
                  <MdMenu />
                </div>
                <div onClick={() => setActive(true)} id="toggleButton">
                  <FaUser />
                </div>
                <div>
                  <FaSun />
                </div>
              </div>
            ) : (
              <div className="icons flex">
                <div style={{ width: '150px' }} onClick={() => hanldeLogin()}>
                  Login
                </div>
                <div
                  onClick={() => handleRegister()}
                  style={{ width: '150px' }}
                >
                  Register
                </div>
              </div>
            )}

            <div
              style={{ zIndex: 999999 }}
              className={`profile ${active ? 'active' : ''} `}
              id="profile"
            >
              <img src={pic1} className="image" alt="" />
              <h3 className="name">{user?.user_name || ''}</h3>
              <p className="role">{user?.role || ''}</p>
              <a href="profile.html" className="btn">
                view profile
              </a>
              <div className="flex-btn">
                <Link
                  onClick={() => {
                    setActive(false);
                    Logout();
                  }}
                  to=""
                  className="option-btn"
                >
                  Logout
                </Link>
                {/* <Link to="" className="option-btn">
                  register
                </Link> */}
              </div>
            </div>
          </section>
        </Header>
        <Breadcrumb>
          {breadCump.map((item, index) => {
            return <Breadcrumb.Item key={index}>{item.title}</Breadcrumb.Item>;
          })}
        </Breadcrumb>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: 'relative',
          }}
        >
          {user?.role === 'admin' ? (
            <Routes>
              <Route path="About" element={<About />} />
              <Route path="Teachers" element={<TeacherManager />} />
              <Route path="Students" element={<AccountManager />} />
              <Route path="Contact" element={<Contact />} />
              <Route path="Profile" element={<Profile />} />
              <Route index element={<Home />} />
              <Route path="VideoCall" element={<VideoCall />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : undefined}
          {user?.role === 'student' || !user ? (
            <Routes>
              <Route path="About" element={<About />} />
              <Route path="Teachers" element={<Teacher />} />
              <Route path="Contact" element={<Contact />} />
              <Route path="Profile" element={<Profile />} />
              <Route index element={<Home />} />
              <Route path="VideoCall" element={<VideoCall />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<PlayListStudent />}></Route>
              <Route path="courses/:id/:ls" element={<LessonStudent />} />
              <Route path="courses/:id/Quizzes" element={<QuestionStudent />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : undefined}
          {user?.role === 'teacher' ? (
            <Routes>
              <Route path="courses" element={<CoursesAdmin />} />
              <Route path="courses/:id" element={<PlayListCourse />}></Route>
              <Route path="courses/:id/:ls" element={<LessonAdmin />} />
              <Route path="courses/:id/Quizzes" element={<Question />} />

              <Route path="About" element={<About />} />
              <Route path="Teachers" element={<Teacher />} />
              <Route path="Contact" element={<Contact />} />
              <Route path="Profile" element={<Profile />} />
              <Route index element={<Home />} />
              <Route path="VideoCall" element={<VideoCall />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : undefined}
          {/* <Route path="*" element={<NotFound />} /> */}
          <Spin spinning={spin} fullscreen size="large"></Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutCommon;
