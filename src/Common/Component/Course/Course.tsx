import React from 'react';
import './index.css';
import { Avatar, Button, Card, Rate } from 'antd';
import pic2 from '../../../assets/pic-2.jpg';
import thumb1 from '../../../assets/thumb-1.png';
import { fetchData } from '../../../Hook/useFetch';
import { useNavigate } from 'react-router-dom';
export interface CourseItem {
  id: number;
  description: number;
  avatar: string;
  user_name: string;
  created_at: string;
  thumbnail: string;
  title: string;
  price: number;
  category: number;
}
const Course: React.FC<{ course: CourseItem }> = ({ course }) => {
  const date = new Date(course.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const navigate = useNavigate();
  const hanldeJoinCourse = () => {
    let idCourse = course.id;
    fetchData(`${process.env.REACT_APP_URL_API_ENROLLMENT}joinCourse`, 'POST', {
      idCourse,
    }).then((data) => {
      if (data.result === 0) {
        document.cookie = `idCourse=${course.id};path=/`;
        navigate(`${course.title.trim()}`);
      }
    });
  };
  return (
    <Card hoverable style={{ width: '100%', position: 'relative' }}>
      <div className="box">
        <div className="tutor">
          <img src={`${process.env.REACT_APP_UPP_LOAD}${course.avatar}`} />
          <div className="info">
            <h3>{course.user_name}</h3>
            <span>{date}</span>
          </div>
        </div>
        <div className="thumb">
          <img
            src={`${process.env.REACT_APP_UPP_LOAD}${course.thumbnail}`}
            alt=""
          />
        </div>
        <h3 className="title">{course.title}</h3>
        <Button onClick={hanldeJoinCourse} className="inline-btn">
          Join Course
        </Button>
      </div>
    </Card>
  );
};

export default Course;
