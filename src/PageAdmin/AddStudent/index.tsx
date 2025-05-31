import React from 'react';
import { fetchData } from '../../Hook/useFetch';
import { Button, Form, FormProps, Input, Typography } from 'antd';
import { AcountModel } from '../../Model/root.model';
import { Dispatch } from '@reduxjs/toolkit';
import { RegisterModel } from '../../Page/Register/Register';
import AccountManager from '../AccountManager';
import AccountManagerStore from '../AccountManager/store/AccountManager.store';

const AddStudent: React.FC<{
  onSucces: Function;
  dispatch: Dispatch;
}> = ({ onSucces, dispatch }) => {
  const [form] = Form.useForm();
  const checkVaidatingPassword = () => {
    if (
      form.getFieldValue('password') !== form.getFieldValue('confimPassword')
    ) {
      return Promise.reject('Mật khẩu chưa giống');
    } else {
      return Promise.resolve('pass');
    }
  };
  const onFinish: FormProps<RegisterModel>['onFinish'] = async () => {
    await form.validateFields();
    fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.getFieldsValue()),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.result === 0) {
          dispatch(AccountManagerStore.actions.addUser(res.data));
          onSucces();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Form
      name="register"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      requiredMark={false}
    >
      <Form.Item<RegisterModel>
        label="Username"
        name="user_name"
        colon={false}
        rules={[{ required: true, message: 'Please input your username' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<RegisterModel> colon={false} label="fullName" name="full_name">
        <Input />
      </Form.Item>
      <Form.Item<RegisterModel> colon={false} label="password" name="password">
        <Input type="password" />
      </Form.Item>
      <Form.Item
        label="Confirm password"
        name="confimPassword"
        rules={[
          {
            validator: checkVaidatingPassword,
          },
        ]}
        validateTrigger="onChange"
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" className="btn" htmlType="submit">
          AddStudent
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddStudent;
