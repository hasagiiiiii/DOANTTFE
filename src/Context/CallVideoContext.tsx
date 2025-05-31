import React, {
  useEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import Peer, { MediaConnection } from 'peerjs';
import useSocket from '../Hook/useSocket';
import Avatar from '../Common/Avatar';
import ReactDOM from 'react-dom';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { getRoomSelect } from '../Store/Room/room.store.selector';
import getCookie from '../Common/Function/Cookie';

// Define types for context state
interface CallVideoContextType {
  handleJoinRoom: (roomId: string) => void; // Define the correct function signature
  peer: Peer | null;
  myStream: MediaStream | null;
  myPeerID: string;
  socket: Socket | null;
  hanldeToggleCamera: any;
  hanldetoggleMic: any;
  hanldeShareScreen: any;
}

// Define types for props
interface CallVideoContextProps {
  children: ReactNode;
}
interface PeerConnections {
  [key: string]: {
    call: any;
    peerConnection: RTCPeerConnection;
    senders: RTCRtpSender[];
  };
}
export const CallVideoContextAPI =
  React.createContext<CallVideoContextType | null>(null);

const CallVideoContext = ({ children }: CallVideoContextProps) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null); // Added state for media stream
  const [myPeerID, setMyPeerID] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const VideoRef = useRef<{ [key: string]: MediaStream }>({}); // Ref to store user video streams
  const [peerInRooms, setPeerInRoom] = useState<PeerConnections>({});
  const room = getCookie('idCourse');

  useEffect(() => {
    const newSocket = io('http://localhost:3001/', {
      // connect to socket Server
      transports: ['websocket'],
    });
    setSocket(newSocket);
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connect to new ');
      });
      socket.on('shareScreen', (idUser: string) => {
        console.log(idUser);
        if (peer && idUser !== myPeerID) {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => UserShareScreen(idUser, peer, stream));
        }
      });
      socket.on('userconnected', (userId: string) => {
        console.log('User connected:', userId);
        if (peer) {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => connectToNewUser(userId, stream, peer))
            .catch((error) => console.error(error));
        }
      });
      socket.on('toggleCamera', (userId, isOpenCamera) => {
        console.log('userId', userId);
        const videoFullScreen = document.querySelector(
          `video[data-userid="${userId}"]`
        );

        console.log(videoFullScreen);
      });
    }
  }, [peer, socket]);
  const connectToNewUser = (
    userId: string,
    stream: MediaStream,
    peer: Peer
  ) => {
    if (userId && !peerInRooms[userId]) {
      console.log('connect stream', stream);
      let call: MediaConnection;
      setTimeout(() => {
        const video = document.createElement('video');
        call = peer.call(userId, stream);
        try {
          call.on('stream', (userVideoStream: MediaStream) => {
            console.log(userVideoStream);
            if (!VideoRef.current[userId]) {
              addVideoStream(video, userVideoStream, userId);
              VideoRef.current[userId] = userVideoStream;
            }
          });
        } catch (e) {
          console.log(e);
        }
        call.on('close', () => {
          console.log('close');
        });

        if (call.peerConnection) {
          setPeerInRoom((prevPeers) => ({
            ...prevPeers,
            [userId]: {
              call,
              peerConnection: call.peerConnection,
              senders: call.peerConnection.getSenders(),
            },
          }));
        } else {
          console.error(`PeerConnection not found for user ${userId}`);
        }
      }, 200);
    }
  };
  const handleJoinRoom = (roomId: string): void => {
    console.log('vao joinRoom');
    const myPeer = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/',
      // secure: true, // Uncomment for HTTPS
    });
    setPeer(myPeer);
    console.log(myPeer);
    myPeer.on('open', (id: string) => {
      console.log('My peer ID is: ' + id);
      try {
        setMyPeerID(id); // You can add state for the peer ID if needed
      } catch (error) {
        console.log(error);
      }
      // Emit the event with two arguments
      if (socket) {
        socket.emit('joinCourse', id, roomId);
        console.log('Emitting joinRoom event:', { idUser: id, roomId: roomId }); // Ensure this matches the expected signature on the server
        setupVideoStream(myPeer, id);
      }
    });
  };
  const setupVideoStream = (peer: Peer, peerId: string) => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          const myVideo = document.createElement('video');
          myVideo.muted = false;
          setMyStream(stream);

          if (!VideoRef.current[peerId]) {
            VideoRef.current[peerId] = stream; // Store the user's stream
            addVideoStream(myVideo, stream, peerId);
          }

          peer.on('call', (call: MediaConnection) => {
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', (userVideoStream: MediaStream) => {
              if (!VideoRef.current[call.peer]) {
                addVideoStream(video, userVideoStream, call.peer);
                VideoRef.current[call.peer] = userVideoStream; // Store the peer's stream
              }
            });
          });
          peer.on('error', (err) => {
            console.error('Peer error:', err);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(document.getElementById('gridVideo'));
  // Function to add video stream to the DOM (you will need to implement this function)
  const addVideoStream = (
    video: HTMLVideoElement,
    stream: MediaStream,
    peerId: string
  ) => {
    // Implement your logic to add the video stream to the DOM
    const container = document.createElement('div');
    container.id = peerId;
    document.getElementById('gridVideo')?.appendChild(container);

    ReactDOM.render(
      <Avatar
        userName="T"
        stream={stream}
        myPeerID={myPeerID}
        socket={socket}
        userId={peerId}
      />,
      container
    );
  };

  const UserShareScreen = (userId: string, peer: Peer, stream: MediaStream) => {
    console.log('userID:', userId);
    console.log('stream', stream);
    if (userId && peer && peer.call) {
      const call = peer.call(userId, stream);
      console.log(call);
      call.on('stream', (userVideoStream) => {
        const video = document.createElement('video');
        console.log('Stream In ShareScreen', userVideoStream);
        if (!VideoRef.current[userId]) {
          addVideoStream(video, userVideoStream, userId);
          VideoRef.current[userId] = userVideoStream;
        }
      });
      call.on('close', () => {
        console.log('closeclose');
      });
    }
  };
  const setUpUserShareScreen = (
    peer: Peer,
    peerId: string,
    streamScreen: MediaStream
  ) => {
    const video = document.createElement('video');
    video.muted = true;
    if (!VideoRef.current[peerId]) {
      VideoRef.current[peerId] = streamScreen;
      addVideoStream(video, streamScreen, myPeerID);
    }
    peer.on('call', (call) => {
      call.answer(streamScreen);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        if (!VideoRef.current[call.peer]) {
          addVideoStream(video, userVideoStream, call.peer);
          VideoRef.current[call.peer] = userVideoStream;
        }
      });
    });
  };

  const handleCallClose = (userId: string) => {
    setPeerInRoom((prevPeers) => {
      const updatedPeers = { ...prevPeers };
      delete updatedPeers[userId];
      return updatedPeers;
    });
  };

  const hanldeShareScreen = async () => {
    const peerStream = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/',
    });
    // setPeerScreen(peerStream);
    peerStream.on('open', async (idPeer) => {
      const streamScreen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      // setShareScreenTrack(streamScreen);
      socket?.emit('shareScreen', idPeer, room);
      setUpUserShareScreen(peerStream, idPeer, streamScreen);
    });
  };
  const hanldeToggleCamera = (roomId: number) => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      if (socket) {
        console.log(socket);
        socket.emit('toggleCamera', myPeerID, roomId, videoTrack.enabled);
      }
    }
  };

  const hanldetoggleMic = (
    setToggleMic: React.Dispatch<React.SetStateAction<boolean>>,
    toggleMic: boolean,
    roomId: number
  ) => {
    if (myStream) {
      setToggleMic(!toggleMic);
      console.log(toggleMic);
      const audioTrack = myStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      if (socket) {
        socket.emit('toggleMic', myPeerID, roomId, audioTrack.enabled);
      }
    }
  };
  const contextValue: CallVideoContextType = {
    peer,
    handleJoinRoom,
    myStream,
    myPeerID,
    socket,
    hanldeToggleCamera,
    hanldetoggleMic,
    hanldeShareScreen,
  };
  return (
    <CallVideoContextAPI.Provider value={contextValue}>
      {children}
    </CallVideoContextAPI.Provider>
  );
};

export default CallVideoContext;
