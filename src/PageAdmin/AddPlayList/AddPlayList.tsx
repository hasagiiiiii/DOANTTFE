import React from 'react';
import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import { LessonItem } from '../../Model/PlayList.model';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Dispatch } from '@reduxjs/toolkit';
import PlaylistAdminStoreReducer from '../PlayListCourse/store/PlaylistAdmin.store.reducer';
import { Result } from '../../Model/root.model';

const AddPlayList: React.FC<{
  idCourse: number;
  onSucces: Function;
  dispatch: Dispatch;
}> = ({ idCourse, onSucces, dispatch }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [banner, setBanner] = React.useState<UploadFile[]>([]);
  const [file, setFile] = React.useState<File>();
  const [fileBanner, setFileBanner] = React.useState<File>();

  const onFinsh: FormProps<LessonItem>['onFinish'] = () => {
    console.log('Success:');
    const value = form.getFieldsValue();
    let formData = new FormData();
    formData.append('course_id', idCourse.toString());
    formData.append('title', value.title);
    formData.append('content', value.content);
    formData.append('order_index', value.order_index);
    if (file && fileBanner) {
      formData.append('video_url', file);
      formData.append('banner', fileBanner);
    } else {
      message.error('Vui lòng chọn một file hợp lệ!');
      return;
    }
    axios
      .post(`${process.env.REACT_APP_URL_API_LESSON}/lesson`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.result == Result.RESULT_SUCCESS) {
          dispatch(
            PlaylistAdminStoreReducer.actions.setPlayList(res.data.data)
          );
          message.success('Thành công');
          onSucces();
        }
        if (res.data.result == Result.RESULT_FALURE) {
          message.error('Thất bại');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinishFailed = () => {
    console.log('Failed:');
  };

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
  const beforeUploadBanner = (file: File) => {
    if (banner.length > 0) {
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
      setFileBanner(file);
      setBanner([
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
    <Form form={form} onFinish={onFinsh} onFinishFailed={onFinishFailed}>
      <Typography.Text>
        Title <span style={{ color: 'red' }}>*</span>
      </Typography.Text>
      <Form.Item<LessonItem>
        name="title"
        rules={[{ required: true, message: 'Please input title!' }]}
      >
        <Input />
      </Form.Item>
      <Typography.Text>
        Description <span style={{ color: 'red' }}>*</span>
      </Typography.Text>
      <Form.Item<LessonItem>
        name="content"
        rules={[{ required: true, message: 'Please input Description!' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Typography.Text>Order Index</Typography.Text>
      <Form.Item<LessonItem> name="order_index">
        <Input type="number" />
      </Form.Item>
      <Typography.Text>
        Video <span style={{ color: 'red' }}>*</span>
      </Typography.Text>
      <Form.Item<LessonItem>
        name="video_url"
        rules={[{ required: true, message: 'Please input Description!' }]}
      >
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
      <Typography.Text>
        Banner <span style={{ color: 'red' }}>*</span>
      </Typography.Text>
      <Form.Item<LessonItem>
        name="banner"
        rules={[{ required: true, message: 'Please choose Banner!' }]}
      >
        <Upload
          beforeUpload={beforeUploadBanner}
          accept="image/*,video/*"
          listType="picture"
          customRequest={handleCustomRequest}
          fileList={banner as UploadFile[]}
          onRemove={() => setBanner([])} // Xóa file khi bấm remove
        >
          <Button type="primary" icon={<UploadOutlined />}>
            Upload
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button className="btn" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddPlayList;
