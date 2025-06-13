import React from 'react';
import { CourseItem } from '../../Common/Component/Course/Course';
import './index.css';
import axios from 'axios';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import AddCourse from '../AddCourse/AddCourse';
import TableCommon from '../../Common/Component/Table/Table';
import UpdateCourse from '../UpdateCourse/UpdateCourse';
import { useDispatch, useSelector } from 'react-redux';
import CourseStoreReducer from './store/Course.store.reducer';
import { getCourse } from './store/Course.store.selector';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const CoursesAdmin = () => {
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
      title: 'thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
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
      render: (text: any, record: CourseItem) => (
        <div className="flex">
          <Button
            onClick={() => handleRowClick(record)}
            style={{ marginRight: 10 }}
          >
            Update
          </Button>
          <Button onClick={() => handleRowClick(record)}>Delete</Button>
        </div>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courses = useSelector(getCourse);
  const handleRowClick = (record: CourseItem): void => {
    let update = ModalCommon.Show({
      title: <h1>Update Course</h1>,
      content: (
        <UpdateCourse
          dispatch={dispatch}
          onSucces={() => update.destroy()}
          course={record}
        />
      ),
    });
    console.log('Bạn đã click vào hàng:', record);
  };
  const hanldeDBClick = (record: CourseItem, index: number) => {
    console.log(record);
    document.cookie = `idCourse=${record.id};path=/`;
    navigate(`${record.title.trim()}`);
  };
  const hanldeRegister = () => {
    const Course = ModalCommon.Show({
      content: (
        <AddCourse dispatch={dispatch} onSucces={() => Course.destroy()} />
      ),
      title: <h1>Add Course</h1>,
      onCancel: () => {},
    });
  };
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL_API_COURSES}coursebyIDUser`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then((data) => {
        dispatch(CourseStoreReducer.actions.setCourse(data.data.data));
      });
  }, []);
  console.log(courses);
  return (
    <div>
      <h1>Our Courses</h1>
      <Button
        className="btn"
        style={{ width: '300px' }}
        onClick={() => hanldeRegister()}
      >
        Add Course
      </Button>
      <TableCommon
        columns={columns}
        // onRowClick={handleRowClick}
        dataSource={courses}
        onDBClick={hanldeDBClick}
      />
    </div>
  );
};

export default CoursesAdmin;
