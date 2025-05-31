import { Button, Card, Checkbox } from 'antd';
import React from 'react';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import AddQuestion from '../AddQuestion/AddQuestion';
import { fetchData } from '../../Hook/useFetch';
import getCookie from '../../Common/Function/Cookie';
import { useDispatch, useSelector } from 'react-redux';
import QuestionAdminStoreReducer from './store/QuestionAdmin.store.reducer';
import { getQuestions } from './store/QuestionAdmin.store.selector';
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
  return (
    <div>
      <Button onClick={() => AddQuest()}>Add Question</Button>
      <div className="flex" style={{ gap: 10 }}>
        {question.map((item, index) => {
          return (
            <Card>
              <h3>{item.question_text}</h3>
              {item.answer.map((as, index) => {
                return <Checkbox key={index}>{as.answer_text}</Checkbox>;
              })}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Question;
