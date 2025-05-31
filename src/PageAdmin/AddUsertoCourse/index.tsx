import { Button, Form, FormProps, Input } from 'antd';
import React from 'react';

const AddUsertoCourse = () => {
  const [form] = Form.useForm();
  const onFinish: FormProps<any>['onFinish'] = async () => {
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
      <Form.Item<any>
        label="Username"
        name="user_name"
        colon={false}
        rules={[{ required: true, message: 'Please input your username' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<any> colon={false} label="fullName" name="full_name">
        <Input />
      </Form.Item>
      <Form.Item<any> colon={false} label="password" name="password">
        <Input type="password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" className="btn" htmlType="submit">
          AddStudent
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddUsertoCourse;
