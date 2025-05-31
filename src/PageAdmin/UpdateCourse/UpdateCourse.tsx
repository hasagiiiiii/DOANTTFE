import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Select,
  Upload,
  UploadFile,
} from 'antd';
import React from 'react';
import { CourseItem } from '../../Common/Component/Course/Course';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import UpdateCourseStoreReducer from './store/UpdateCourse.store.reducer';
import { Dispatch } from '@reduxjs/toolkit';
import CourseStoreReducer from '../CoursesAdmin/store/Course.store.reducer';
interface OptionType {
  label: string;
  value: string;
}
const UpdateCourse: React.FC<{
  course: CourseItem;
  onSucces: Function;
  dispatch: Dispatch<any>;
}> = ({ course, onSucces, dispatch }) => {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [file, setFile] = React.useState<File>();
  const [category, setCategory] = React.useState<OptionType[]>();
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL_API}category`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((data) => setCategory(data.data.data));

    form.setFieldsValue(course);
    console.log(course);
  }, []);
  const [form] = Form.useForm();
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
  const onFinish: FormProps<CourseItem>['onFinish'] = async () => {
    const values = form.getFieldsValue();
    const formData = new FormData();
    formData.append('category', values.category);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('id', course.id.toString());
    console.log(values);
    if (file) {
      formData.append('thumbnail', file); // ✅ Đảm bảo file hợp lệ
    } else {
      message.error('Vui lòng chọn một file hợp lệ!');
      return;
    }
    axios
      .post(`${process.env.REACT_APP_URL_API_COURSES}updateCourse`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then((data) => {
        dispatch(CourseStoreReducer.actions.updateCoure(data.data.data));
        onSucces();
      });
  };
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item<CourseItem>
        name="title"
        rules={[{ required: true, message: 'Please Insert Title' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<CourseItem>
        name="description"
        rules={[{ required: true, message: 'Please Insert Description' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item<CourseItem>
        name="price"
        rules={[{ required: true, message: 'Please Insert Price' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<CourseItem> name="thumbnail">
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
      <Form.Item<CourseItem>
        name="category"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Select>
          {category?.map((item, index) => {
            return (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button className="btn" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateCourse;
