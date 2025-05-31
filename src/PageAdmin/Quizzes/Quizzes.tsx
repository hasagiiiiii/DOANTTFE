import React from 'react';
import TableCommon from '../../Common/Component/Table/Table';
import { Button } from 'antd';
import QuizzesStoreReducer, {
  QuizzesItem,
} from './store/Quizzes.store.reducer';
import { fetchData } from '../../Hook/useFetch';
import { Dispatch } from '@reduxjs/toolkit';
import { NavigateFunction, NavigateOptions } from 'react-router-dom';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import UpdateQuizzes from '../UpdateQuizzes/UpdateQuizzes';
import AddQuizzes from '../AddQuizzes/AddQuizzes';
import { ModalessCustom } from '../../Common/ModalessCustom/ModalessCustom';

const Quizzes: React.FC<{
  idCourse: number;
  dispatch: Dispatch;
  navigate: NavigateFunction;
  onDestroy: Function;
}> = ({ idCourse, dispatch, navigate, onDestroy }) => {
  const [quizzesList, setQuizzesList] = React.useState<QuizzesItem[]>([]);
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
  const handleAddQuizzes = () => {
    const addPlayList = ModalCommon.Show({
      title: <h1>Add Lesson</h1>,
      content: (
        <AddQuizzes
          onSucces={() => addPlayList.destroy()}
          idCourse={idCourse}
          dispatch={dispatch}
        />
      ),
      afterClose: () => {
        hanldeGetQuizze();
      },
      width: 600,
    });
  };
  const hanldeUpdateQuizze = (record: QuizzesItem) => {
    const update = ModalCommon.Show({
      title: <h1>Update Quizzes</h1>,
      content: (
        <UpdateQuizzes
          dispatch={dispatch}
          onSucces={() => update.destroy()}
          values={record}
        />
      ),
      afterClose: () => {
        update.destroy();
        hanldeGetQuizze();
      },
    });
  };

  const hanldeDoubleClick = (record: QuizzesItem, index: number) => {
    if (record.title === 'Bài Tập Về Nhà') {
      document.cookie = `idQuizze=${record.id};path=/`;
      ModalessCustom('/vsCode', 'vsCode', record.description);
      onDestroy();
    } else {
      onDestroy();
      document.cookie = `idQuizze=${record.id};path=/`;
      navigate(`Quizzes`);
    }
  };
  const hanldeDelete = async (record: QuizzesItem) => {
    fetchData('');
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
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: QuizzesItem) => (
        <div className="flex">
          <Button
            onClick={() => hanldeUpdateQuizze(record)}
            style={{ marginRight: 10 }}
          >
            Update
          </Button>
          <Button>Delete</Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Button onClick={handleAddQuizzes}>AddQuizz</Button>
      <TableCommon
        height={400}
        onDBClick={hanldeDoubleClick}
        dataSource={quizzesList}
        columns={columns}
      />
    </div>
  );
};

export default Quizzes;
