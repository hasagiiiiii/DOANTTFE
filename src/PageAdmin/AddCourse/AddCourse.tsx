import {
  Button,
  Form,
  Input,
  message,
  Select,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import React from 'react';
import { FormProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import getCookie from '../../Common/Function/Cookie';
import { Dispatch } from '@reduxjs/toolkit';
import CourseStoreReducer from '../CoursesAdmin/store/Course.store.reducer';
import { getLocalStorage } from '../../Common/Function/LocalStorage';
export interface AddCourseModel {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: number;
}
const AddCourse: React.FC<{ onSucces: Function; dispatch: Dispatch<any> }> = ({
  onSucces,
  dispatch,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [file, setFile] = React.useState<File>();
  const [category, setCategory] = React.useState<[]>();
  const user = getLocalStorage('user');
  React.useEffect(() => {
    console.log(user.id);
    axios
      .get(`${process.env.REACT_APP_URL_API}category`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((data) => setCategory(data.data.data));
  }, []);
  const onFinsh: FormProps<AddCourseModel>['onFinish'] = async () => {
    if (fileList.length === 0) {
      message.error('Vui lòng upload ít nhất một file!');
      return;
    }
    const values = form.getFieldsValue();
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    // formData.append('price', values.price);
    formData.append('category', values.category);
    formData.append('teacher_id', user.id);
    console.log(file);
    if (file) {
      formData.append('thumbnail', file); // ✅ Đảm bảo file hợp lệ
    } else {
      message.error('Vui lòng chọn một file hợp lệ!');
      return;
    }
    console.log(formData.get('thumbnail'));

    // Thêm tất cả các file vào FormData
    try {
      const response = await axios.post(
        'http://localhost:3001/courses/course',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      if (response.data.result === 0) {
        dispatch(CourseStoreReducer.actions.insertCourse(response.data.data));
      }
      onSucces();
      message.success('Upload thành công!');
      console.log(response.data);
    } catch (error) {
      message.error('Lỗi khi upload!');
      console.error(error);
    }
  };
  const onFinshFaild: FormProps<AddCourseModel>['onFinishFailed'] = () => {};

  const beforeUpload = (file: File) => {
    if (fileList.length > 0) {
      message.error('Chỉ được upload tối đa 1 file!');
      return false;
    } else {
      const isImageOrVideo =
        file.type?.startsWith('image/') || file.type?.startsWith('video/');
      if (!isImageOrVideo) {
        message.error('Chỉ được phép upload ảnh hoặc video!');
        return false;
      }
      const preview = URL.createObjectURL(file);
      setFile(file);
      setFileList([
        {
          uid: `${Date.now()}`, // Fix lỗi uid không tồn tại
          name: file.name,
          status: 'done',
          url: preview,
          fileName: file.name,
        },
      ]);
      return isImageOrVideo; // Chỉ cho phép upload nếu là ảnh hoặc video
    }
  };
  const handleCustomRequest = ({ file, onSuccess }: any) => {
    // Giả lập upload thành công sau 1 giây
    setTimeout(() => {
      onSuccess('ok');
      message.success(`${file.name} đã được upload thành công`);
    }, 1000);
  };
  return (
    <Form onFinish={onFinsh} onFinishFailed={onFinshFaild} form={form}>
      <Typography.Text>Title</Typography.Text>
      <Form.Item<AddCourseModel>
        name="title"
        rules={[{ required: true, message: 'Please input your title' }]}
      >
        <Input />
      </Form.Item>

      <Typography.Text>Description</Typography.Text>
      <Form.Item<AddCourseModel>
        name="description"
        rules={[{ required: true, message: 'Please input your description!' }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Typography.Text>Price</Typography.Text>
      {/* <Form.Item<AddCourseModel>
        name="price"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item> */}
      <Typography.Text>Category</Typography.Text>
      <Form.Item<AddCourseModel>
        name="category"
        rules={[{ required: true, message: 'Please Select a category!' }]}
      >
        <Select options={category} />
      </Form.Item>
      <Form.Item<AddCourseModel> name="thumbnail">
        <Upload
          beforeUpload={beforeUpload}
          accept="image/*,video/*"
          listType="picture"
          customRequest={handleCustomRequest}
          fileList={fileList as UploadFile[]}
          onRemove={() => setFileList([])} // Xóa file khi bấm remove
        >
          <Button type="primary" icon={<UploadOutlined />}>
            Upload
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item<AddCourseModel>>
        <Button className="btn" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCourse;
