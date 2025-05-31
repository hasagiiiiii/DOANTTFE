import React from 'react';
import TableCommon from '../../Common/Component/Table/Table';
import { Button, notification } from 'antd';

import { fetchData } from '../../Hook/useFetch';
import { Dispatch } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import { QuizzesItem } from '../../PageAdmin/Quizzes/store/Quizzes.store.reducer';
import { ModalessCustom } from '../../Common/ModalessCustom/ModalessCustom';

const QuizzesStudent: React.FC<{
  idCourse: number;
  dispatch: Dispatch;
  navigate: NavigateFunction;
  onDestroy: Function;
}> = ({ idCourse, dispatch, navigate, onDestroy }) => {
  const [quizzesList, setQuizzesList] = React.useState<QuizzesItem[]>([]);
  const [api, contextHolder] = notification.useNotification();
  React.useEffect(() => {
    hanldeGetQuizze();
  }, []);
  const hanldeGetQuizze = () => [
    fetchData(`${process.env.REACT_APP_URL_API_QUIZZES}quizzes`, 'POST', {
      idCourse,
    }).then((data) =>
      // dispatch(QuizzesStoreReducer.actions.getAllQuizzes(data.data))
      setQuizzesList(data.data)
    ),
  ];
  const Context = React.createContext({ name: 'Default' });
  const hanldeDoubleClick = (record: QuizzesItem, index: number) => {
    if (record.title === 'Bài Tập Về Nhà') {
      document.cookie = `idQuizze=${record.id};path=/`;
      ModalessCustom('/vsCode', 'vsCode', record.description);
      onDestroy();
    } else {
      fetchData(`${process.env.REACT_APP_URL_API_ANSWER}getCore`, 'POST', {
        idQuizz: record.id,
      }).then((data) => {
        if (!data.data) {
          document.cookie = `idQuizze=${record.id};path=/`;
          navigate(`Quizzes`);
          console.log('vao day');
          onDestroy();
          return;
        }
        if (data?.data?.score || data.data.score > 0) {
          api.error({
            message: 'Đã hết số lượt làm bài',
            duration: 3,
            description: (
              <Context.Consumer>
                {({ name }) => `Hello, ${name}!`}
              </Context.Consumer>
            ),
            placement: 'topRight',
          });
        }
      });
    }
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
      title: 'description',
      dataIndex: 'description',
      key: 'description',
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
  ];
  return (
    <div>
      {contextHolder}
      <TableCommon
        height={400}
        onDBClick={hanldeDoubleClick}
        dataSource={quizzesList}
        columns={columns}
      />
    </div>
  );
};

export default QuizzesStudent;
