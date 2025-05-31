import { Dispatch } from '@reduxjs/toolkit';
import React from 'react';
import { fetchData } from '../../Hook/useFetch';
import TableCommon from '../../Common/Component/Table/Table';

const Score: React.FC<{
  dispatch: Dispatch;
  onSucces: Function;
  idCourse: number;
}> = ({ dispatch, onSucces, idCourse }) => {
  const [score, setScore] = React.useState<any[]>([]);
  const columns = [
    {
      title: 'Username',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'FullName',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'avatar',
      dataIndex: 'avatar',
      key: 'avatar',
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
      title: 'Bài kiểm tra giữa môn',
      dataIndex: 'giuamon',
      key: 'giuamon',
    },
    {
      title: 'Bài kiểm tra kết thúc môn',
      dataIndex: 'kethuc',
      key: 'kethuc',
    },
  ];
  const hanldeConverData = (data: any) => {
    return Object.values(
      data.reduce((acc: any, curr: any) => {
        const key = curr.user_name;
        if (!acc[key]) {
          acc[key] = {
            user_name: curr.user_name,
            full_name: curr.full_name,
            avatar: curr.avatar,
            kethuc: 0,
            giuamon: 0,
          };
        }

        if (curr.title === 'Bài kiểm tra giữa môn') {
          acc[key].giuamon = parseFloat(curr.score);
        } else if (curr.title === 'Bài kiểm tra kết thúc môn') {
          acc[key].kethuc = parseFloat(curr.score);
        }

        return acc;
      }, {})
    );
  };
  React.useEffect(() => {
    fetchData(`${process.env.REACT_APP_URL_API_COURSES}ViewScore`, 'POST', {
      course_id: idCourse,
    }).then((data) => setScore(hanldeConverData(data.data)));
  }, []);
  return (
    <div>
      <TableCommon columns={columns} dataSource={score} />
    </div>
  );
};

export default Score;
