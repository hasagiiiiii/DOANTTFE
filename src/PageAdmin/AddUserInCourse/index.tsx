import { Dispatch } from '@reduxjs/toolkit';
import { Button, Input, message, Typography } from 'antd';
import React from 'react';
import { fetchData } from '../../Hook/useFetch';
import { Result } from '../../Model/root.model';

const AddUserInCourse: React.FC<{
  dispatch: Dispatch;
  onSucces: Function;
  idCourse: number;
}> = ({ dispatch, onSucces, idCourse }) => {
  const [userName, setUsername] = React.useState('');
  const Submit = async () => {
    fetchData(
      `${process.env.REACT_APP_URL_API_ENROLLMENT}addUsertoRoom`,
      'POST',
      {
        idCourse: idCourse,
        user_name: userName,
      }
    ).then((data) => {
      if (data.result === Result.RESULT_SUCCESS) {
        message.success('Thành Công', 10);
      }
      if (data.result === Result.RESULT_FALURE) {
        message.error('Thất bại', 10);
      }
      onSucces();
    });
  };
  return (
    <div>
      <Typography.Text>UserName</Typography.Text>
      <Input
        required
        onChange={(e) => setUsername(e.target.value)}
        value={userName}
      />
      <Button onClick={Submit} className="btn">
        Add
      </Button>
    </div>
  );
};

export default AddUserInCourse;
