import { Avatar, Button, Card, Menu } from 'antd';
import React, { MouseEventHandler } from 'react';
import './index.css';
import { CiChat1 } from 'react-icons/ci';
const AccountInList: React.FC<{
  img: string;
  name: string;
  callback?: Function;
}> = ({ img, name, callback }) => {
  const [show, setShow] = React.useState(false);
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShow(true);
  };
  const handleMouseDown = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest('#menu-acc')) {
      setShow(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [show]);
  const hanldeClick = () => {
    if (callback) {
      callback();
    }
  };
  return (
    <div
      onContextMenu={handleContextMenu}
      style={{ position: 'relative' }}
      className="flex account-card"
    >
      <div className="flex" style={{ alignItems: 'center', flex: 1 }}>
        <Avatar
          size="large"
          src={`${process.env.REACT_APP_UPP_LOAD}${img}`}
          alt=""
        />
        <h3>{name}</h3>
      </div>
      <div
        className="icon flex"
        style={{ alignItems: 'center', marginLeft: 30 }}
      >
        <CiChat1 size={30} style={{ zIndex: 999 }} />
      </div>
      <Card
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 99999,
        }}
        className={show ? 'show' : ''}
        id="menu-acc"
      >
        <Menu>
          <Button size="middle" onClick={hanldeClick} danger>
            DELETE
          </Button>
        </Menu>
      </Card>
    </div>
  );
};

export default AccountInList;
