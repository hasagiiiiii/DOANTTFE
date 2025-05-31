import React from 'react';
import './index.css';
import useSocket from '../../Hook/useSocket';

// Định nghĩa các kiểu cho props
interface AvatarProps {
  stream: MediaStream;
  myPeerID?: string;
  userId: string;
  userName: string;
  socket: any; // Thay đổi loại này tùy theo kiểu socket mà bạn đang sử dụng (ví dụ: io.Socket)
  // ViewFullScreen: (userId: string) => void; // Hàm callback khi xem full screen
}

// Mở rộng kiểu HTMLVideoElement để thêm thuộc tính isActiveCamera và captureStream
interface ExtendedHTMLVideoElement extends HTMLVideoElement {
  isActiveCamera: boolean;
  captureStream: () => MediaStream; // Thêm kiểu cho phương thức captureStream
}

const Avatar: React.FC<AvatarProps> = React.memo(
  ({ stream, userName = 'T', userId, socket }) => {
    const videoRef = React.useRef<ExtendedHTMLVideoElement>(null);
    const activeRef = React.useRef<boolean>(true);

    React.useEffect(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play();
        });
        videoRef.current.setAttribute('data-userId', userId);
      }
    }, [stream, userId]);

    React.useEffect(() => {
      if (socket) {
        socket.on('connect', () => {});
        socket.on('toggleCamera', (idUser: string, isActiveCamera: boolean) => {
          activeRef.current = isActiveCamera;
          if (userId === idUser) {
            if (videoRef.current) {
              videoRef.current.isActiveCamera = isActiveCamera;
              const videoFullScreen = document.querySelector(
                `video[data-userid="${idUser}"]`
              ) as ExtendedHTMLVideoElement;
              if (videoFullScreen) {
                videoFullScreen.classList.toggle('off');
                videoFullScreen.captureStream().getVideoTracks()[0].enabled =
                  isActiveCamera;
              }
            }
          }
        });
      }
    }, [socket, userId]);

    return (
      <div className="parenVideo">
        <video
          ref={videoRef}
          playsInline
          controls={false}
          muted={false}
        ></video>
        <div className="avartar">{userName}</div>
      </div>
    );
  }
);

export default Avatar;
