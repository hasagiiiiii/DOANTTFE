import {
  Button,
  Checkbox,
  CheckboxChangeEvent,
  Form,
  Input,
  Typography,
} from 'antd';
import React from 'react';
// import './index.css';
import { fetchData } from '../../Hook/useFetch';
import getCookie from '../../Common/Function/Cookie';
import NotificationService from '../../Common/Component/Notification/Notification';
export interface Question {
  text: string;
}
export interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}
const initialFormValue = {
  question_text: '',
  answer: [
    {
      id: 0,
      answer_text: '',
      is_correct: false,
    },
    {
      id: 0,
      answer_text: '',
      is_correct: false,
    },
    {
      id: 0,
      answer_text: '',
      is_correct: false,
    },
    {
      id: 0,
      answer_text: '',
      is_correct: false,
    },
  ],
};
const UpdateQuestion: React.FC<{ onSucces: Function; data: any }> = ({
  onSucces,
  data,
}) => {
  const [form] = Form.useForm();
  const [formValue, setFormValue] = React.useState(initialFormValue);
  const idQuizz = getCookie('idQuizze');
  const onFinish = () => {
    let check = false;
    formValue.answer.map((item, index) => {
      if (item.is_correct === true) check = true;
    });
    if (check) {
      let datares = {
        idQuestion: data.id,
        text: formValue.question_text,
        type: 'multiple_choice',
        answer: formValue.answer,
      };
      fetchData(`${process.env.REACT_APP_URL_API_QUESTION}update`, 'POST', {
        datares,
      }).then((data) => {
        if (data.result === 0) {
          onSucces();
        }
      });
    } else {
      NotificationService.error(
        'Chưa chọn đáp án đúng',
        'Hãy chọn 1 đáp án đúng'
      );
    }
  };

  React.useEffect(() => {
    setFormValue({
      ...formValue,
      question_text: data.question_text,
      answer: formValue.answer.map((item, index) => {
        return {
          ...item,
          answer_text: data.answer[index].answer_text,
          is_correct: false,
          id: data.answer[index].id,
        };
      }),
    });
  }, [data]);
  console.log(formValue, data);

  const onChangeInput = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setFormValue({
      ...formValue,
      answer: formValue.answer.map((item, index) => {
        return index + 1 === i
          ? {
              answer_text: e.target.value,
              is_correct: item.is_correct,
              id: item.id,
            }
          : item;
      }),
    });
  };
  const hanldeOnchangeQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      question_text: e.target.value,
      answer: [...formValue.answer],
    });
  };
  const TrueAnswer = (i: number, e: CheckboxChangeEvent) => {
    setFormValue({
      ...formValue,
      answer: formValue.answer.map((item, index) => {
        return index + 1 === i
          ? {
              answer_text: item.answer_text,
              is_correct: e.target.checked,
              id: item.id,
            }
          : { answer_text: item.answer_text, is_correct: false, id: item.id };
      }),
    });
  };
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        rules={[{ required: true, message: 'Pleease insert your question' }]}
      >
        <Input
          onChange={(e) => hanldeOnchangeQuestion(e)}
          value={formValue.question_text}
          placeholder="Question ?"
        />
      </Form.Item>
      {formValue.answer.map((item, index) => {
        return (
          <div key={index}>
            <Typography.Text>Đáp án {++index}</Typography.Text>

            <Input
              onChange={(e) => onChangeInput(index, e)}
              value={item.answer_text}
              required
            />
            <Checkbox
              onChange={(e) => TrueAnswer(index, e)}
              checked={item.is_correct}
            >
              Đáp án đúng
            </Checkbox>
          </div>
        );
      })}

      <Button className="btn" htmlType="submit">
        Subm8it
      </Button>
    </Form>
  );
};

export default UpdateQuestion;
