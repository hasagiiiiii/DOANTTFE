import { Button, Checkbox, Form, FormProps, Input } from 'antd';
import { AppContextAPI } from '../../Context/AppContext';
import React from 'react';
import { LoginModel } from './store/login.component';
import './index.css';
import { LoginService } from './store/login.model.service';
const Login: React.FC<{
  onSucces: Function;
  setSpin: React.Dispatch<React.SetStateAction<boolean>>;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}> = ({ onSucces, setSpin, setLogin, setUser }) => {
  const [form] = Form.useForm();
  const onFinish: FormProps<LoginModel>['onFinish'] = () => {
    const value = form.getFieldsValue();
    LoginService(value).then((data) => {
      document.cookie = `user = ${JSON.stringify(data.data)};path=/`;
      // localStorage.setItem('user', JSON.stringify(data.data));
      setUser(data.data);
    });
    setSpin(true);
    setTimeout(() => {
      setSpin(false);
      window.location.reload();
    }, 1000);
    setLogin(true);
    onSucces();
  };
  const onFinishFailed: FormProps<LoginModel>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
    >
      <Form.Item<LoginModel>
        label="Username"
        name="user_name"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<LoginModel>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<LoginModel>
        name="remember"
        valuePropName="checked"
        label={null}
      >
        <Checkbox defaultChecked={false}>Remember me</Checkbox>
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
