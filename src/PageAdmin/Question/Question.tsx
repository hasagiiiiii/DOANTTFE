import { Button, Card, Checkbox } from 'antd';
import React from 'react';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import AddQuestion from '../AddQuestion/AddQuestion';
import { fetchData } from '../../Hook/useFetch';
import getCookie from '../../Common/Function/Cookie';
import { useDispatch, useSelector } from 'react-redux';
import QuestionAdminStoreReducer from './store/QuestionAdmin.store.reducer';
import { getQuestions } from './store/QuestionAdmin.store.selector';
import UpdateQuestion from '../UpdateQuestion';
import { CloseOutlined } from '@ant-design/icons';
import {
  MessageConfirm,
  MessageConfirmModal,
} from '../../Common/Component/MessageComponent';
const initialFormValue: QuestionItem[] = [
  {
    question_text: '',
    answer: [
      {
        answer_text: '',
        id: 0,
      },
      {
        answer_text: '',
        id: 0,
      },
      {
        answer_text: '',
        id: 0,
      },
      {
        answer_text: '',
        id: 0,
      },
    ],
  },
];
export interface QuestionItem {
  question_text: string;
  answer: { answer_text: string; id: number }[];
}
const Question = () => {
  //   const [question, setQuestion] =
  //     React.useState<QuestionItem[]>(initialFormValue);
  const question = useSelector(getQuestions);
  const dispatch = useDispatch();
  const id_quizze = getCookie('idQuizze');
  React.useEffect(() => {
    hanmdleCallQuestion();
  }, []);
  const hanmdleCallQuestion = () => {
    fetchData(`${process.env.REACT_APP_URL_API_QUESTION}getQuestion`, 'POST', {
      id_quizze,
    }).then((data) =>
      dispatch(QuestionAdminStoreReducer.actions.setQuestion(data.data))
    );
  };
  const AddQuest = () => {
    const addQuest = ModalCommon.Show({
      title: <h1>Add Question</h1>,
      content: <AddQuestion onSucces={() => addQuest.destroy()} />,
      width: 700,
      afterClose: () => {
        hanmdleCallQuestion();
      },
    });
  };
  const hanldeDBClick = (item: QuestionItem) => {
    console.log(item);
    const addQuest = ModalCommon.Show({
      title: <h1>Add Question</h1>,
      content: (
        <UpdateQuestion data={item} onSucces={() => addQuest.destroy()} />
      ),
      width: 700,
      afterClose: () => {
        hanmdleCallQuestion();
      },
    });
  };
  const hanldeDelete = async (item: QuestionItem) => {
    const result = await MessageConfirmModal({
      title: <h1>Xóa câu hỏi ?</h1>,
      content: 'Bạn có đồng ý xóa câu hỏi ?',
    });

    if (result == MessageConfirm.NO) return;

    fetchData(`${process.env.REACT_APP_URL_API_QUESTION}delete`, 'POST', item);
  };
  return (
    <div>
      <Button onClick={() => AddQuest()}>Add Question</Button>
      <div className="flex" style={{ gap: 10, flexWrap: 'wrap' }}>
        {question.map((item, index) => {
          return (
            <Card
              onDoubleClick={() => hanldeDBClick(item)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                flex: '0 0 370px',
                padding: '10px',
                position: 'relative',
              }}
            >
              {/* <Button
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '30px',
                  border: 'none',
                }}
                onClick={() => hanldeDelete(item)}
              >
                <CloseOutlined />
              </Button> */}
              <h3>{item.question_text}</h3>
              {item.answer.map((as, index) => {
                return (
                  <label style={{ display: 'flex' }} key={index}>
                    Câu trả lời {index + 1} : {as.answer_text}
                  </label>
                );
              })}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Question;
