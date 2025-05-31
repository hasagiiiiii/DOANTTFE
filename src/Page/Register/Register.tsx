import { Form, FormProps, Input, Button } from 'antd';
import React from 'react';
import './index.css';
export interface RegisterModel {
  user_name: string;
  password: string;
  full_name: string;
}
const Register: React.FC<{ onSucces: Function }> = ({ onSucces }) => {
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
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
