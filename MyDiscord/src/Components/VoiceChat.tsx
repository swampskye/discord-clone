import { Button } from "antd";
import axios from "axios";
import io from "socket.io-client";
import { useRef, useEffect } from "react";
const socket = io("http://localhost:5555/voice");

const userId = localStorage.getItem("userId");
const VoiceChat = ({ channelId }) => {
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  //   console.log("channelId in voice Chat", channelId);
  const joinVoiceChannel = async () => {
    try {
      await axios.post(
        `http://localhost:5555/api/server/${channelId}/voice/join`,
        { userId: localStorage.getItem("userId") },
        { withCredentials: true }
      );
      socket.emit("joinVoiceChannel", { channelId, userId });
      //   socket.join(channelId);
      // 这里让第一个用户创建 offer
      //   console.log(peerConnectionRef.current);
      if (peerConnectionRef.current) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("offer", { channelId, offer });
      }
    } catch (error) {
      console.error("加入失败", error);
    }
  };
  const leaveVoiceChannel = async () => {
    try {
      await axios.post(
        `http://localhost:5555/api/server/${channelId}/voice/leave`,
        { userId: localStorage.getItem("userId") },
        { withCredentials: true }
      );
      socket.emit("leaveVoiceChannel", { channelId, userId });
      stopMediaStreams();
      stopPeerConnection();
    } catch (error) {
      console.error("离开失败", error);
    }
  };
  const stopMediaStreams = () => {
    if (localStreamRef.current && localStreamRef.current.srcObject) {
      const stream = localStreamRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    if (localStreamRef.current) localStreamRef.current.srcObject = null;
  };
  const stopPeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  useEffect(() => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    // console.log(peerConnection);
    peerConnectionRef.current = peerConnection;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        if (localStreamRef.current) localStreamRef.current.srcObject = stream;
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
      });

    peerConnection.ontrack = (event) => {
      //   console.log(remoteStreamRef.current);
      //   console.log(event.streams);
      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { channelId, candidate: event.candidate });
      }
    };

    socket.on("offer", async (offer) => {
      console.log("listen on offer");
      console.log(offer);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", { channelId, answer });
    });

    socket.on("answer", async (answer) => {
      console.log("listen on answer");
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async (candidate) => {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      peerConnection.close();
      socket.disconnect();
    };
  }, [channelId]);
  return (
    <div>
      <h1>VoiceChat</h1>
      <h1>channelId-{channelId}</h1>
      <Button onClick={joinVoiceChannel}>Join</Button>
      <Button onClick={leaveVoiceChannel}>Leave</Button>
      <h1>local</h1>
      <video style={{ width: "100px" }} ref={localStreamRef} autoPlay muted />
      <h1>remote</h1>
      <video style={{ width: "100px" }} ref={remoteStreamRef} autoPlay />
    </div>
  );
};

export default VoiceChat;
