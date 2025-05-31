import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Select,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import React from 'react';
import { AcountModel, Result } from '../../Model/root.model';
import { fetchFormData } from '../../Hook/useFetch';
import { UploadOutlined } from '@ant-design/icons';
import { ProfileModel } from '../Profile/Profile';

const UpdateProfile: React.FC<{
  account: ProfileModel;
  onSucces: Function;
}> = ({ account, onSucces }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [file, setFile] = React.useState<File>();
  const onFinsh: FormProps<ProfileModel>['onFinish'] = () => {
    const value = form.getFieldsValue();
    let formData = new FormData();
    formData.append('id', account.id.toString());
    formData.append('user_name', value.user_name);
    formData.append('full_name', value.full_name);
    formData.append('password', value.password);
    formData.append('role', account.role);
    if (file) {
      formData.append('avartar', file);
    }
    fetchFormData(
      `${process.env.REACT_APP_URL_API_USER}/updateUser`,
      'POST',
      formData
    ).then((data) => {
      if (data.result == Result.RESULT_SUCCESS) {
        window.location.reload();
      }
    });
    onSucces();
  };
  const onFinishFailed = () => {
    console.log('Failed:');
  };
  React.useEffect(() => {
    form.setFieldsValue(account);
  }, []);
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
    <Form form={form} onFinish={onFinsh} onFinishFailed={onFinishFailed}>
      <Typography.Text>UserName</Typography.Text>
      <Form.Item<AcountModel>
        name="user_name"
        rules={[{ required: true, message: 'Please input new username!' }]}
      >
        <Input />
      </Form.Item>
      <Typography.Text>FullName</Typography.Text>
      <Form.Item<AcountModel>
        name="full_name"
        rules={[{ required: true, message: 'Please input FullName!' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Typography.Text>Password</Typography.Text>
      <Form.Item<AcountModel> name="password">
        <Input type="password" />
      </Form.Item>
      <Typography.Text>Avartar</Typography.Text>
      <Form.Item<AcountModel> name="avartar">
        <Upload
          beforeUpload={beforeUpload}
          accept="image/*"
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
      <Form.Item>
        <Button className="btn" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProfile;
