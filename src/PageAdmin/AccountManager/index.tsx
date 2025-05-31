import React from 'react';
import AccountManagerStore from './store/AccountManager.store';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TableCommon from '../../Common/Component/Table/Table';
import { getAcount } from './store/AcountManager.store.selector';
import { fetchData } from '../../Hook/useFetch';
import PagingCommon from '../../Common/Component/Paging/paging';
import { AcountModel } from '../../Model/root.model';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import UpdateAccount from '../UpdateAccount';
import AddStudent from '../AddStudent';

const AccountManager = () => {
  const columns = [
    // {
    //   title: 'STT',
    //   dataIndex: 'id',
    //   key: 'id',
    //   sorter: (a: { id: number }, b: { id: number }) => a.id - b.id, // ✅ Sắp xếp theo số
    // },
    {
      title: 'user_name',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'full_name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (img: string) => {
        return (
          <img
            width={40}
            height={40}
            src={`http://localhost:3001/uploads/${img}`}
            alt="icon"
          />
        );
      },
    },

    {
      title: 'created_at',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => {
        let da = new Date(date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        return <p>{da}</p>;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: AcountModel) => (
        <div className="flex">
          <Button
            onClick={() => handleDbClick(record)}
            style={{ marginRight: 10 }}
          >
            Update
          </Button>
          <Button onClick={() => hanldeDelete(record)}>Delete</Button>
        </div>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [paging, setPaging] = React.useState({
    page: 1,
    limit: 10,
    total: 100,
  });
  const listStudent = useSelector(getAcount);

  React.useEffect(() => {
    fetchData(`${process.env.REACT_APP_URL_API_USER}getStudent`, 'POST', {
      page: 1,
      limit: 10,
    }).then((data) =>
      dispatch(AccountManagerStore.actions.setAllUser(data.data.students))
    );
    hanldeSetLoading();
  }, []);
  const hanldeSetLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };
  const handleChangeSize = (pageSize: number) => {
    console.log(pageSize);
    setPaging((pre) => ({ ...pre, limit: pageSize }));
    fetchData(`${process.env.REACT_APP_URL_API_USER}getStudent`, 'POST', {
      page: paging.page,
      limit: pageSize,
    }).then((data) =>
      dispatch(AccountManagerStore.actions.setAllUser(data.data.students))
    );
    hanldeSetLoading();
  };
  const hanldeDelete = async (record: AcountModel) => {
    fetchData(`${process.env.REACT_APP_URL_API_USER}deleteUser`, 'POST', {
      id: record.id,
    }).then((data) =>
      dispatch(AccountManagerStore.actions.deleteAccount(data.data))
    );
    hanldeSetLoading();
  };
  const handleChangePage = (pageNumber: number) => {
    console.log(pageNumber);
    setPaging((pre) => ({ ...pre, page: pageNumber }));
    fetchData(`${process.env.REACT_APP_URL_API_USER}getStudent`, 'POST', {
      page: pageNumber,
      limit: paging.limit,
    }).then((data) =>
      dispatch(AccountManagerStore.actions.setAllUser(data.data.students))
    );
    hanldeSetLoading();
  };
  const handleDbClick = async (record: AcountModel) => {
    console.log(record);
    const account = ModalCommon.Show({
      title: <h1>Update Account</h1>,
      content: (
        <UpdateAccount
          account={record}
          dispatch={dispatch}
          onSucces={() => account.destroy()}
        />
      ),
    });
  };
  const hanldeAddStudent = async () => {
    const studentNew = ModalCommon.Show({
      title: <h1>Add Student</h1>,
      content: (
        <AddStudent dispatch={dispatch} onSucces={() => studentNew.destroy()} />
      ),
    });
  };
  return (
    <div>
      <Button onClick={hanldeAddStudent}>Add Student</Button>
      <PagingCommon
        total={paging.total}
        pageSize={paging.limit}
        onPageSizeChange={handleChangeSize}
        onChangePage={handleChangePage}
        current={paging.page}
      />
      <TableCommon
        onDBClick={handleDbClick}
        rowKey="id"
        columns={columns}
        dataSource={listStudent}
        loading={loading}
      />
    </div>
  );
};

export default AccountManager;
