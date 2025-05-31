import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Select,
  Typography,
} from 'antd';
import React from 'react';
import { fetchData } from '../../Hook/useFetch';
import { OPTION_Quizzes, Result } from '../../Model/root.model';
import { Dispatch } from '@reduxjs/toolkit';
import QuizzesStoreReducer from '../Quizzes/store/Quizzes.store.reducer';
export interface Quizzes {
  title: string;
  description: string;
}
const AddQuizzes: React.FC<{
  idCourse: number;
  onSucces: Function;
  dispatch: Dispatch;
}> = ({ idCourse, onSucces, dispatch }) => {
  const [form] = Form.useForm();
  const onFinsh: FormProps<Quizzes>['onFinish'] = () => {
    const value = form.getFieldsValue();
    const data = { ...value, idCourse };
    fetchData(`${process.env.REACT_APP_URL_API_QUIZZES}quizzesIn`, 'POST', {
      data,
    }).then((data) => {
      if (data.result == 0) {
        dispatch(QuizzesStoreReducer.actions.insertQuizzes(data.data));
        message.success('Thành công');
        onSucces();
      }
      if (data.result === Result.RESULT_FALURE) {
        message.error('Thất bại');
      }
    });
  };
  return (
    <Form form={form} onFinish={onFinsh}>
      <Typography.Text>Title</Typography.Text>
      <Form.Item<Quizzes>
        name="title"
        rules={[{ required: true, message: 'Please input Tittle!' }]}
      >
        <Select options={OPTION_Quizzes} />
      </Form.Item>
      <Typography.Text>Description</Typography.Text>
      <Form.Item<Quizzes>
        name="description"
        rules={[{ required: true, message: 'Please input Description!' }]}
      >
        <Input />
      </Form.Item>
      <Button htmlType="submit" className="btn">
        Submit
      </Button>
    </Form>
  );
};

export default AddQuizzes;
