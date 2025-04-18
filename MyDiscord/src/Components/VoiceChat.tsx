// import { Button } from "antd";
// import axios from "axios";
// import io from "socket.io-client";
// import { useRef, useEffect } from "react";
// const socket = io("http://localhost:5555/voice");

// const userId = localStorage.getItem("userId");
// const VoiceChat = ({ channelId }) => {
//   const localStreamRef = useRef<HTMLVideoElement>(null);
//   const remoteStreamRef = useRef<HTMLVideoElement>(null);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

//   //   console.log("channelId in voice Chat", channelId);
//   const joinVoiceChannel = async () => {
//     try {
//       await axios.post(
//         `http://localhost:5555/api/server/${channelId}/voice/join`,
//         { userId: localStorage.getItem("userId") },
//         { withCredentials: true }
//       );
//       socket.emit("joinVoiceChannel", { channelId, userId });
//       //   socket.join(channelId);
//       // 这里让第一个用户创建 offer
//       //   console.log(peerConnectionRef.current);
//       if (peerConnectionRef.current) {
//         const offer = await peerConnectionRef.current.createOffer();
//         await peerConnectionRef.current.setLocalDescription(offer);
//         socket.emit("offer", { channelId, offer });
//       }
//     } catch (error) {
//       console.error("加入失败", error);
//     }
//   };
//   const leaveVoiceChannel = async () => {
//     try {
//       await axios.post(
//         `http://localhost:5555/api/server/${channelId}/voice/leave`,
//         { userId: localStorage.getItem("userId") },
//         { withCredentials: true }
//       );
//       socket.emit("leaveVoiceChannel", { channelId, userId });
//       stopMediaStreams();
//       stopPeerConnection();
//     } catch (error) {
//       console.error("离开失败", error);
//     }
//   };
//   const stopMediaStreams = () => {
//     if (localStreamRef.current && localStreamRef.current.srcObject) {
//       const stream = localStreamRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     if (localStreamRef.current) localStreamRef.current.srcObject = null;
//   };
//   const stopPeerConnection = () => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }
//   };

//   useEffect(() => {
//     const peerConnection = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
//     // console.log(peerConnection);
//     peerConnectionRef.current = peerConnection;

//     navigator.mediaDevices
//       .getUserMedia({ audio: true, video: true })
//       .then((stream) => {
//         if (localStreamRef.current) localStreamRef.current.srcObject = stream;
//         stream
//           .getTracks()
//           .forEach((track) => peerConnection.addTrack(track, stream));
//       });

//     peerConnection.ontrack = (event) => {
//       //   console.log(remoteStreamRef.current);
//       //   console.log(event.streams);
//       if (remoteStreamRef.current) {
//         remoteStreamRef.current.srcObject = event.streams[0];
//       }
//     };

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", { channelId, candidate: event.candidate });
//       }
//     };

//     socket.on("offer", async (offer) => {
//       console.log("listen on offer");
//       console.log(offer);
//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(offer)
//       );
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);
//       socket.emit("answer", { channelId, answer });
//     });

//     socket.on("answer", async (answer) => {
//       console.log("listen on answer");
//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(answer)
//       );
//     });

//     socket.on("ice-candidate", async (candidate) => {
//       await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//     });

//     return () => {
//       peerConnection.close();
//       socket.disconnect();
//     };
//   }, [channelId]);
//   return (
//     <div>
//       <h1>VoiceChat</h1>
//       <h1>channelId-{channelId}</h1>
//       <Button onClick={joinVoiceChannel}>Join</Button>
//       <Button onClick={leaveVoiceChannel}>Leave</Button>
//       <h1>local</h1>
//       <video style={{ width: "100px" }} ref={localStreamRef} autoPlay muted />
//       <h1>remote</h1>
//       <video style={{ width: "100px" }} ref={remoteStreamRef} autoPlay />
//     </div>
//   );
// };

// export default VoiceChat;

import { Button } from "antd";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import SimplePeer from "simple-peer";
import styled from "styled-components";
import micmute from "../assets/micmute.svg";
import micunmute from "../assets/micunmute.svg";
import webcam from "../assets/webcam.svg";
import webcamoff from "../assets/webcamoff.svg";

// const socket = io("http://localhost:5555/voice");

const userId = localStorage.getItem("userId");
const VoiceChat = ({ channelId }) => {
  const [peers, setPeers] = useState([]);
  // const [audioFlag, setAudioFlag] = useState(true);
  // const [videoFlag, setVideoFlag] = useState(true);
  // const [userUpdate, setUserUpdate] = useState([]);
  const socketRef = useRef<Socket | null>(null);
  const userVideo = useRef(null);
  const peersRef = useRef([]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5555/voice");
    // console.log("my socket id:", socketRef.current.id);
    createStream();
    console.log("peers:", peers);
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 已断开 voice 命名空间连接");
      }
    };
  }, []);

  function createStream() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", channelId);
        // for new user to create peer
        socketRef.current.on("all users", (users) => {
          console.log("all users:", users);
          const newPeers = [];
          users.forEach((userID) => {
            console.log("createPeer");
            const peer = createPeer(userID, socketRef.current.id, stream);
            console.log("socketRef.current.id:", socketRef.current.id);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            newPeers.push({
              peerID: userID,
              peer,
            });
          });
          setPeers(newPeers);
        });
        // for current users to add peer
        socketRef.current.on("user joined", (payload) => {
          console.log(
            "======================user joined========================"
          );
          console.log("==", payload);
          console.log(payload.signal);
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          console.log(peer);

          const peerObj = {
            peer,
            peerID: payload.callerID,
          };
          // console.log(peersRef.current === peerObj);
          // console.log("peers:", peers);
          // console.log("peerobj:", peerObj);
          // console.log("peersRef.current:", peersRef.current);
          setPeers((users) => [...users, peerObj]);
        });

        socketRef.current!.on("user left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        });

        socketRef.current!.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find(
            (p: any) => p.peerID === payload.id
          );
          console.log(
            "----------------item in receiving returned signal-------------"
          );
          console.log(item);
          item.peer.signal(payload.signal);
        });

        // socketRef.current!.on("change", (payload) => {
        //   setUserUpdate(payload);
        // });
      });
  }

  function createPeer(userToSignal, callerID, stream) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302", // Google 提供的公共 STUN 服务器
          },
          // {
          //   urls: "stun:stun.services.mozilla.com", // Mozilla 提供的 STUN 服务器
          // },
        ],
      },
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("offer", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302", // Google 提供的公共 STUN 服务器
          },
          // {
          //   urls: "stun:stun.services.mozilla.com", // Mozilla 提供的 STUN 服务器
          // },
        ],
      },
    });

    peer.on("signal", (signal) => {
      console.log("signal");
      socketRef.current.emit("answer", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const Video = (props) => {
    const ref = useRef(null);

    useEffect(() => {
      console.log("peer in Video component:", props.peer);
      props.peer.on("stream", (stream) => {
        console.log("remote stream:", stream);
        if (ref.current) {
          ref.current!.srcObject = stream;
        }
      });

      props.peer.on("error", (err) => {
        console.log("Error in peer connection:", err);
      });
    }, []);

    return (
      <div>
        <video
          style={{ width: "100px" }}
          ref={ref}
          autoPlay
          muted
          playsInline
        />
      </div>
    );
    // return <StyledVideo playsInline autoPlay ref={ref} />;
  };

  return (
    <div>
      <h1>VoiceChat</h1>
      <h1>channelId-{channelId}</h1>
      {/* <Button onClick={joinVoiceChannel}>Join</Button>
      <Button onClick={leaveVoiceChannel}>Leave</Button> */}
      <h1>local</h1>
      <video style={{ width: "100px" }} ref={userVideo} autoPlay muted />
      <h1>remote</h1>
      {peers.map((peer: any, index) => {
        return (
          <div key={index}>
            <h1>{peer.peerID}</h1>
            <Video peer={peer.peer} />
            {/* <video style={{ width: "100px" }} ref={userVideo} autoPlay /> */}
          </div>
        );
      })}
      {/* <video style={{ width: "100px" }} ref={remoteStreamRef} autoPlay /> */}
    </div>
  );
};

export default VoiceChat;
