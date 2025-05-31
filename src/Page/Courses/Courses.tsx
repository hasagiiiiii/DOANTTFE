import { Alert, Button, Col, Flex, Row } from 'antd';
import React from 'react';
import Course, { CourseItem } from '../../Common/Component/Course/Course';
import { fetchData } from '../../Hook/useFetch';
const Courses = () => {
  const [courses, setCourses] = React.useState<CourseItem[]>([]);

  React.useEffect(() => {
    fetchData(
      `${process.env.REACT_APP_URL_API_COURSES}getCoursebyStudent`,
      'POST'
    ).then((data) => setCourses(data.data));
  }, []);
  console.log(courses);
  return (
    <div>
      <h1>Our Courses</h1>
      <Flex wrap="wrap" gap={20}>
        {courses.map((item) => {
          return (
            <Col key={item.id}>
              <Course course={item} />
            </Col>
          );
        })}
      </Flex>
    </div>
  );
};
export default Courses;
