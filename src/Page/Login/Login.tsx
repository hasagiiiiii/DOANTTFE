import { Button, Checkbox, Form, FormProps, Input } from 'antd';
import { AppContextAPI } from '../../Context/AppContext';
import React from 'react';
import { LoginModel } from './store/login.component';
import './index.css';
import { LoginService } from './store/login.model.service';
import { Result } from '../../Model/root.model';
import Banner from '../../assets/contact-img.svg';
const Login: React.FC<{
  onSucces: Function;
  setSpin: React.Dispatch<React.SetStateAction<boolean>>;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}> = ({ onSucces, setSpin, setLogin, setUser }) => {
  const [form] = Form.useForm();
  const [validateUser, setValidateUser] = React.useState<boolean>(false);
  const [validatePassword, setValidatePassword] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    if (validateUser) {
      form.validateFields(['user_name']);
    }
  }, [validateUser]);
  React.useEffect(() => {
    if (validatePassword) {
      form.validateFields(['password']);
    }
  }, [validatePassword]);
  const onFinish: FormProps<LoginModel>['onFinish'] = () => {
    const value = form.getFieldsValue();
    LoginService(value).then((data) => {
      if (data.result == Result.RESULT_SUCCESS) {
        document.cookie = `user = ${JSON.stringify(data.data)};path=/`;
        localStorage.setItem('user', JSON.stringify(data.data));
        setUser(data.data);
        setSpin(true);
        setTimeout(() => {
          setSpin(false);
          window.location.reload();
        }, 1000);
        setLogin(true);
        window.location.href = '/';
        onSucces();
      }
      if (data.result == Result.RESULT_PASSWORD) {
        setValidatePassword(true);
      }
      if (data.result == Result.RESULT_NOTFOUND) {
        setValidateUser(true);
      }
    });
  };
  const onFinishFailed: FormProps<LoginModel>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      className="flex"
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <div className="banner">
        <img
          src={Banner}
          width={400}
          height={400}
          alt="Hình ảnh sản phẩm điện thoại iPhone 15"
        />
      </div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        style={{ width: '600px', translate: '-100px' }}
      >
        <Form.Item<LoginModel>
          label="Username"
          name="user_name"
          rules={[
            { required: true, message: 'Please input your username!' },
            {
              validator: (_, value) => {
                if (validateUser) {
                  return Promise.reject('Username không tồn tại!');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input onChange={() => setValidateUser(false)} />
        </Form.Item>

        <Form.Item<LoginModel>
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              validator: (_, value) => {
                if (validatePassword) {
                  return Promise.reject('Mật khẩu sai');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password onChange={() => setValidatePassword(false)} />
        </Form.Item>

        <Form.Item<LoginModel>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox defaultChecked={false}>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button className="btn" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
