import { Avatar, Menu } from 'antd';
import React, { MouseEventHandler } from 'react';
import './index.css';
import { CiChat1 } from 'react-icons/ci';
const AccountInList: React.FC<{ img: string; name: string }> = ({
  img,
  name,
}) => {
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
      <div
        style={{
          position: 'absolute',
          top: 0,
          display: show ? 'block' : 'none',
        }}
        id="menu-acc"
      >
        <Menu>
          <Menu.Item>Hello</Menu.Item>
          <Menu.Item>Hello</Menu.Item>
          <Menu.Item>Hello</Menu.Item>
          <Menu.Item>Hello</Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default AccountInList;
