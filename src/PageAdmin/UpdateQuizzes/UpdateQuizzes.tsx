import React from 'react';
import { Button, Form, FormProps, Input, Typography } from 'antd';
import { Quizzes } from '../AddQuizzes/AddQuizzes';
import { fetchData } from '../../Hook/useFetch';
import QuizzesStoreReducer, {
  QuizzesItem,
} from '../Quizzes/store/Quizzes.store.reducer';
import { Dispatch } from '@reduxjs/toolkit';

const UpdateQuizzes: React.FC<{
  dispatch: Dispatch;
  values: QuizzesItem;
  onSucces: Function;
}> = ({ values, onSucces, dispatch }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(values);
  });
  const onFinsh: FormProps<Quizzes>['onFinish'] = () => {
    const value = form.getFieldsValue();
    let id = values.id;
    const data = { ...value, id };
    fetchData(`${process.env.REACT_APP_URL_API_QUIZZES}updateQuize`, 'POST', {
      data,
    }).then((data) => {
      if (data.result == 0) {
        dispatch(QuizzesStoreReducer.actions.updateQuizzes(data.data));
        onSucces();
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
        <Input />
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

export default UpdateQuizzes;
