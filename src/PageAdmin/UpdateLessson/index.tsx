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
import { Quizzes } from '../AddQuizzes/AddQuizzes';
import { fetchData, fetchFormData } from '../../Hook/useFetch';
import { UploadOutlined } from '@ant-design/icons';

import { Dispatch } from '@reduxjs/toolkit';
import LessonStoreReducer, {
  LessonItem,
} from '../Lesson/store/Lesson.store.reducer';
import axios from 'axios';
import PlaylistAdminStoreReducer, {
  PlayListItem,
} from '../PlayListCourse/store/PlaylistAdmin.store.reducer';

const UpdateLesson: React.FC<{
  dispatch: Dispatch;
  values: PlayListItem;
  onSucces: Function;
}> = ({ values, onSucces, dispatch }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [banner, setBanner] = React.useState<UploadFile[]>([]);
  const [file, setFile] = React.useState<File>();
  const [fileBanner, setFileBanner] = React.useState<File>();
  React.useEffect(() => {
    form.setFieldsValue(values);
  });
  const onFinsh: FormProps<LessonItem>['onFinish'] = () => {
    console.log('Success:');
    const value = form.getFieldsValue();
    let formData = new FormData();
    formData.append('id', values.id.toString());
    formData.append('title', value.title);
    formData.append('content', value.content);
    if (file) {
      formData.append('video_url', file);
    }
    fetchFormData(
      `${process.env.REACT_APP_URL_API_LESSON}/updateLesson`,
      'POST',
      formData
    )
      .then((res) => {
        console.log(res);
        if (res.result == 0) {
          dispatch(LessonStoreReducer.actions.upateLessson(res.data));
          dispatch(PlaylistAdminStoreReducer.actions.upatePlayList(res.data));
          onSucces();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinishFailed = () => {
    console.log('Failed:');
  };
  console.log(values);
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
      <Typography.Text>Title</Typography.Text>
      <Form.Item<LessonItem>
        name="title"
        rules={[{ required: true, message: 'Please input title!' }]}
      >
        <Input />
      </Form.Item>
      <Typography.Text>Description</Typography.Text>
      <Form.Item<LessonItem>
        name="content"
        rules={[{ required: true, message: 'Please input Description!' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Typography.Text>Video</Typography.Text>
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
      <Typography.Text>Banner</Typography.Text>
      <Form.Item<PlayListItem> name="banner">
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

export default UpdateLesson;
