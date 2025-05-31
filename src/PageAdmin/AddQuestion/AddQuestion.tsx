import {
  Button,
  Checkbox,
  CheckboxChangeEvent,
  Form,
  Input,
  Typography,
} from 'antd';
import React from 'react';
import './index.css';
import { fetchData } from '../../Hook/useFetch';
import getCookie from '../../Common/Function/Cookie';
import NotificationService from '../../Common/Component/Notification/Notification';
export interface Question {
  text: string;
}
export interface Answer {
  text: string;
  is_correct: boolean;
}
const initialFormValue = {
  text: '',
  answer: [
    {
      text: '',
      is_correct: false,
    },
    {
      text: '',
      is_correct: false,
    },
    {
      text: '',
      is_correct: false,
    },
    {
      text: '',
      is_correct: false,
    },
  ],
};
const AddQuestion: React.FC<{ onSucces: Function }> = ({ onSucces }) => {
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
        quiz_id: idQuizz,
        text: formValue.text,
        type: 'multiple_choice',
        answer: formValue.answer,
      };
      fetchData(
        `${process.env.REACT_APP_URL_API_QUESTION}questionByID`,
        'POST',
        {
          datares,
        }
      ).then((data) => {
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
  const onChangeInput = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      answer: formValue.answer.map((item, index) => {
        return index + 1 === i
          ? { text: e.target.value, is_correct: item.is_correct }
          : item;
      }),
    });
  };
  const hanldeOnchangeQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      text: e.target.value,
      answer: [...formValue.answer],
    });
  };
  const TrueAnswer = (i: number, e: CheckboxChangeEvent) => {
    console.log(e.target.checked);
    setFormValue({
      ...formValue,
      answer: formValue.answer.map((item, index) => {
        return index + 1 === i
          ? { text: item.text, is_correct: e.target.checked }
          : { text: item.text, is_correct: false };
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
          value={formValue.text}
          placeholder="Question ?"
        />
      </Form.Item>
      {formValue.answer.map((item, index) => {
        return (
          <div key={index}>
            <Typography.Text>Đáp án {++index}</Typography.Text>
            <Form.Item
              name={`answer${index}`}
              rules={[
                { required: true, message: 'Pleease insert your answer' },
              ]}
              required
            >
              <Input
                onChange={(e) => onChangeInput(index, e)}
                value={item.text}
              />
            </Form.Item>
            <Form.Item>
              <Checkbox
                onChange={(e) => TrueAnswer(index, e)}
                checked={item.is_correct}
              >
                Đáp án đúng
              </Checkbox>
            </Form.Item>
          </div>
        );
      })}

      <Button className="btn" htmlType="submit">
        Subm8it
      </Button>
    </Form>
  );
};

export default AddQuestion;
