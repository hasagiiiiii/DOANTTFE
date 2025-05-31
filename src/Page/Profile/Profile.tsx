import React from 'react';
import './index.css';
import { CiBookmark } from 'react-icons/ci';
import { CiHeart } from 'react-icons/ci';
import { LuMessageCircle } from 'react-icons/lu';
import { fetchData } from '../../Hook/useFetch';
import ModalCommon from '../../Common/Component/Modal/Modal.component';
import UpdateProfile from '../UpdateProfile';
import { Button } from 'antd';
export interface ProfileModel {
  id: number;
  full_name: string;
  user_name: string;
  role: string;
  avatar: string;
}
const Profile = () => {
  const [user, setUser] = React.useState<ProfileModel>();
  React.useEffect(() => {
    fetchData(`${process.env.REACT_APP_URL_API_USER}profile`, 'GET').then(
      (data) => setUser(data.data)
    );
  }, []);
  const handleUpdateProfile = async () => {
    const updatePro = ModalCommon.Show({
      title: <h1>Update Profile</h1>,
      content: (
        <UpdateProfile
          account={user!}
          key={'UpdateProfile'}
          onSucces={() => updatePro.destroy()}
        />
      ),
    });
  };
  return (
    <section className="user-profile">
      <h1 style={{ fontSize: 40 }}>Your Profile</h1>

      <div className="info">
        <div className="user">
          <img
            src={`${process.env.REACT_APP_UPP_LOAD}${user?.avatar}`}
            alt=""
          />
          <h3>{user?.user_name}</h3>
          <p>{user?.full_name}</p>
          <Button
            onClick={handleUpdateProfile}
            style={{ padding: '20px 50px 46px' }}
            className="inline-btn"
          >
            update profile
          </Button>
        </div>

        <div className="box-container">
          <div className="box">
            <div className="flex">
              <div className="icons">
                <CiBookmark size={35} />
              </div>
              <div>
                <span>4</span>
                <p>saved playlist</p>
              </div>
            </div>
            <a href="#" className="inline-btn">
              view playlists
            </a>
          </div>

          <div className="box">
            <div className="flex">
              <div className="icons">
                <CiHeart size={35} />
              </div>
              <div>
                <span>33</span>
                <p>videos liked</p>
              </div>
            </div>
            <a href="#" className="inline-btn">
              view liked
            </a>
          </div>

          <div className="box">
            <div className="flex">
              <div className="icons">
                <LuMessageCircle size={35} />
              </div>
              <div>
                <span>12</span>
                <p>videos comments</p>
              </div>
            </div>
            <a href="#" className="inline-btn">
              view comments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
