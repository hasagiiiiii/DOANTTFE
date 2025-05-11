import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'peerjs';
import Avatar from '../../Common/Avatar';
import { FaMicrophoneSlash } from 'react-icons/fa';
import { IoIosMic } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import CallVideoContext, {
  CallVideoContextAPI,
} from '../../Context/CallVideoContext';
import './index.css';
import useSocket from '../../Hook/useSocket';
import { useSelector } from 'react-redux';
import { getRoomSelect } from '../../Store/Room/room.store.selector';
import { Button } from 'antd';
import getCookie from '../../Common/Function/Cookie';

const VideoCall: React.FC = () => {
  const [peerScreen, setPeerScreen] = useState<Peer | null>(null);
  const [toggleMic, setToggleMic] = useState<boolean>(false);
  const [toggleCamera, setToggleCamera] = useState<boolean>(false);
  const [courseID, setCourseID] = useState<any>();
  const VideoRef = useRef<Record<string, MediaStream>>({});
  const [shareScreenTrack, setShareScreenTrack] = useState<MediaStream | null>(
    null
  );

  const [fullScreen, setFullScreen] = useState<number>(1);
  const { hanldeToggleCamera, hanldetoggleMic, hanldeShareScreen } =
    React.useContext(CallVideoContextAPI)!;
  const navigate = useNavigate();
  React.useEffect(() => {}, []);
  return (
    <div>
      <div className="function flex">
        <Button onClick={() => hanldeShareScreen(courseID)}>
          Share Screen
        </Button>
        <Button
          onClick={() => hanldetoggleMic(setToggleMic, toggleMic, courseID)}
        >
          {toggleMic ? <FaMicrophoneSlash size={30} /> : <IoIosMic />}
        </Button>
        <Button onClick={() => hanldeToggleCamera(courseID)}>
          Toggle Camera
        </Button>
      </div>
      <div id="gridVideo"></div>
    </div>
  );
};

export default React.memo(VideoCall);
