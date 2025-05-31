import React from 'react';
import './index.css';
import video from '../../assets/vid-1.mp4';
import { fetchData } from '../../Hook/useFetch';
import getCookie from '../../Common/Function/Cookie';
import { FaCalendar } from 'react-icons/fa';
import { Button } from 'antd';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import LessonStoreReducer, { LessonItem } from './store/Lesson.store.reducer';
import UpdateLesson from '../UpdateLessson';
import { useDispatch, useSelector } from 'react-redux';
import { getLesson } from './store/Lesson.store.selector';

const LessonAdmin = () => {
  const idCourse = getCookie('idCourse');
  const idLesson = getCookie('idLesson');

  React.useEffect(() => {
    fetchData(`${process.env.REACT_APP_URL_API_LESSON}getLesson`, 'POST', {
      idCourse,
      idLesson,
    }).then((data) => dispatch(LessonStoreReducer.actions.insert(data.data)));
  }, []);
  let lesson = useSelector(getLesson);
  const date: string = new Date(lesson?.created_at || Date.now())
    .toISOString()
    .split('T')[0];
  const dispatch = useDispatch();
  const update = () => {
    // const updateLess = ModalCommon.Show({
    //   title: <h1>Update Lesson</h1>,
    //   content: (
    //     <UpdateLesson
    //       dispatch={dispatch}
    //       values={lesson}
    //       onSucces={() => updateLess.destroy()}
    //     />
    //   ),
    // });
  };
  return (
    <div>
      <section className="watch-video">
        <div className="video-container">
          <div className="video">
            <video
              src={
                `${process.env.REACT_APP_UPP_LOAD}${lesson?.video_url}` ||
                undefined
              }
              controls
              poster="images/post-1-1.png"
              id="video"
              crossOrigin="anonymous"
            ></video>
          </div>
          <h3 className="title">{lesson?.title}</h3>
          <div className="info">
            <p className="date flex">
              <FaCalendar />
              <span>{date}</span>
            </p>
            {/* <p className="date">
              <i className="fas fa-heart"></i>
              <span>44 likes</span>
            </p> */}
          </div>
          <div className="tutor">
            <img
              src={`${process.env.REACT_APP_UPP_LOAD}${lesson?.avatar}`}
              alt=""
            />
            <div>
              <h3>{lesson?.user_name}</h3>
              <span>{lesson?.role}</span>
            </div>
          </div>
          <form action="" method="post" className="flex">
            <Button
              style={{ padding: '5px 20px 48px' }}
              onClick={() => update()}
              className="inline-btn"
            >
              Update Lesson
            </Button>
          </form>
          <p className="description">
            {/* Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque
            labore ratione, hic exercitationem mollitia obcaecati culpa dolor
            placeat provident porro. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Aliquid iure autem non fugit sint. A, sequi rerum
            architecto dolor fugiat illo, iure velit nihil laboriosam cupiditate
            voluptatum facere cumque nemo! */}
            {lesson.content}
          </p>
        </div>
      </section>

      {/* <section className="comments">
        <h1 className="heading">5 comments</h1>

        <form action="" className="add-comment">
          <h3>add comments</h3>
          <textarea
            name="comment_box"
            placeholder="enter your comment"
            required
            // maxlength="1000"
            // cols="30"
            // rows="10"
          ></textarea>
          <input
            type="submit"
            value="add comment"
            className="inline-btn"
            name="add_comment"
          />
        </form>

        <h1 className="heading">user comments</h1>

        <div className="box-container">
          <div className="box">
            <div className="user">
              <img src="images/pic-1.jpg" alt="" />
              <div>
                <h3>shaikh anas</h3>
                <span>22-10-2022</span>
              </div>
            </div>
            <div className="comment-box">
              this is a comment form shaikh anas
            </div>
            <form action="" className="flex-btn">
      <input type="submit" value="edit comment" name="edit_comment" className="inline-option-btn">
      <input type="submit" value="delete comment" name="delete_comment" className="inline-delete-btn">
      </form>
          </div>

          <div className="box">
            <div className="user">
              <img src="images/pic-2.jpg" alt="" />
              <div>
                <h3>john deo</h3>
                <span>22-10-2022</span>
              </div>
            </div>
            <div className="comment-box">awesome tutorial! keep going!</div>
          </div>

          <div className="box">
            <div className="user">
              <img src="images/pic-3.jpg" alt="" />
              <div>
                <h3>john deo</h3>
                <span>22-10-2022</span>
              </div>
            </div>
            <div className="comment-box">
              amazing way of teaching! thank you so much!
            </div>
          </div>

          <div className="box">
            <div className="user">
              <img src="images/pic-4.jpg" alt="" />
              <div>
                <h3>john deo</h3>
                <span>22-10-2022</span>
              </div>
            </div>
            <div className="comment-box">
              loved it, thanks for the tutorial!
            </div>
          </div>

          <div className="box">
            <div className="user">
              <img src="images/pic-5.jpg" alt="" />
              <div>
                <h3>john deo</h3>
                <span>22-10-2022</span>
              </div>
            </div>
            <div className="comment-box">
              this is what I have been looking for! thank you so much!
            </div>
          </div>

          <div className="box">
            <div className="user">
              <img src="images/pic-2.jpg" alt="" />
              <div>
                <h3>john deo</h3>
                <span>22-10-2022</span>
              </div>
            </div>
            <div className="comment-box">
              thanks for the tutorial! how to download source code file?
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default LessonAdmin;
