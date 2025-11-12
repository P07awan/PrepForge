import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor, 
  MonitorOff, 
  MessageSquare, 
  Send,
  Users,
  Clock,
  X
} from 'lucide-react';

interface VideoRoomProps {
  roomId: string;
  userId: string;
  userName: string;
  onLeave: () => void;
}

export default function VideoRoom({ roomId, userId, userName, onLeave }: VideoRoomProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<Map<string, { stream: MediaStream; name: string }>>(new Map());
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{ userId: string; message: string; timestamp: Date }>>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [pipPosition, setPipPosition] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const screenStreamRef = useRef<MediaStream | null>(null);
  const pipRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('join-room', { roomId, userId });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, userId]);

  // Initialize local media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Please allow camera and microphone access to join the interview.');
      }
    };

    initializeMedia();

    return () => {
      // Cleanup local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // WebRTC signaling handlers
  useEffect(() => {
    if (!socket || !localStreamRef.current) return;

    const createPeerConnection = (remoteSocketId: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      // Add local stream tracks to peer connection
      localStreamRef.current?.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });

      // Handle incoming tracks
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setRemoteUsers(prev => {
          const newMap = new Map(prev);
          newMap.set(remoteSocketId, { stream: remoteStream, name: 'Remote User' });
          return newMap;
        });
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            roomId,
            candidate: event.candidate,
            to: remoteSocketId,
          });
        }
      };

      peerConnectionsRef.current.set(remoteSocketId, pc);
      return pc;
    };

    // Handle new user joining
    socket.on('user-joined', async ({ socketId }: { socketId: string }) => {
      console.log('User joined:', socketId);
      
      const pc = createPeerConnection(socketId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('offer', {
        roomId,
        offer,
        to: socketId,
      });
    });

    // Handle incoming offer
    socket.on('offer', async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      console.log('Received offer from:', from);
      
      const pc = createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer', {
        roomId,
        answer,
        to: from,
      });
    });

    // Handle incoming answer
    socket.on('answer', async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
      console.log('Received answer from:', from);
      
      const pc = peerConnectionsRef.current.get(from);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Handle ICE candidate
    socket.on('ice-candidate', async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
      const pc = peerConnectionsRef.current.get(from);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Handle user leaving
    socket.on('user-left', ({ userId: leftUserId }: { userId: string }) => {
      console.log('User left:', leftUserId);
      
      setRemoteUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(leftUserId);
        return newMap;
      });

      const pc = peerConnectionsRef.current.get(leftUserId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(leftUserId);
      }
    });

    // Handle chat messages
    socket.on('chat-message', ({ userId: senderId, message, timestamp }: any) => {
      setMessages(prev => [...prev, { userId: senderId, message, timestamp: new Date(timestamp) }]);
    });

    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
      socket.off('chat-message');
    };
  }, [socket, roomId]);

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      
      // Switch back to camera
      if (localStreamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      
      setIsScreenSharing(false);
      socket?.emit('stop-screen-share', { roomId });
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        
        screenStreamRef.current = screenStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        socket?.emit('start-screen-share', { roomId });

        // Handle when user stops sharing from browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (localStreamRef.current && localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        };
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim() && socket) {
      socket.emit('chat-message', {
        roomId,
        message: chatMessage,
      });
      setChatMessage('');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = pipRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && pipRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within bounds
      const maxX = window.innerWidth - pipRef.current.offsetWidth - 20;
      const maxY = window.innerHeight - pipRef.current.offsetHeight - 20;
      
      setPipPosition({
        x: Math.max(20, Math.min(newX, maxX)),
        y: Math.max(20, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleLeave = () => {
    if (socket) {
      socket.emit('leave-room', { roomId });
    }
    
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    
    onLeave();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header Bar */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Live Interview</span>
            </div>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">{remoteUsers.size + 1} participant{remoteUsers.size !== 0 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Room: {roomId.slice(0, 8)}</span>
          </div>
        </div>
      </div>

      {/* Main Video Container - Full Screen Remote Video */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {/* Remote Video (Large - Background) */}
        {remoteUsers.size > 0 ? (
          Array.from(remoteUsers.entries()).map(([socketId, { stream, name }]) => (
            <div key={socketId} className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
              <video
                autoPlay
                playsInline
                ref={(el) => {
                  if (el) el.srcObject = stream;
                }}
                className="w-full h-full object-cover"
              />
              {/* Remote User Info */}
              <div className="absolute bottom-24 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <p className="text-white font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {name}
                </p>
              </div>
            </div>
          ))
        ) : (
          /* Waiting for Remote User */
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center">
            <div className="text-center p-12">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <p className="text-gray-300 text-xl font-semibold mb-2">Waiting for others to join...</p>
              <p className="text-gray-500 text-sm">Share the room link with your interview partner</p>
            </div>
          </div>
        )}

        {/* Local Video (Picture-in-Picture - Small Draggable) */}
        <div
          ref={pipRef}
          className={`absolute z-20 rounded-2xl overflow-hidden shadow-2xl border-2 transition-all ${
            isDragging 
              ? 'cursor-grabbing scale-105 border-blue-500' 
              : 'cursor-grab hover:scale-105 border-gray-600/50 hover:border-blue-500/70'
          }`}
          style={{
            left: `${pipPosition.x}px`,
            top: `${pipPosition.y}px`,
            width: '280px',
            height: '210px',
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            
            {/* Local User Info */}
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
              <p className="text-white text-xs font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                {userName} (You)
              </p>
            </div>

            {/* Status Indicators */}
            <div className="absolute top-2 right-2 flex gap-1.5">
              {!isAudioEnabled && (
                <div className="bg-red-500/90 backdrop-blur-sm p-1.5 rounded-lg">
                  <MicOff className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              {isScreenSharing && (
                <div className="bg-blue-500/90 backdrop-blur-sm p-1.5 rounded-lg">
                  <Monitor className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Camera Off State */}
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-white text-2xl font-bold">{userName[0]?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Drag Hint */}
            <div className={`absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent pointer-events-none opacity-0 ${
              !isDragging && 'hover:opacity-100'
            } transition-opacity`}></div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      {/* Controls Bar */}
      <div className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`group relative p-4 rounded-2xl transition-all transform hover:scale-105 ${
              isVideoEnabled
                ? 'bg-gray-700/80 hover:bg-gray-600 text-white shadow-lg'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20'
            }`}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {isVideoEnabled ? 'Turn off' : 'Turn on'}
            </span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`group relative p-4 rounded-2xl transition-all transform hover:scale-105 ${
              isAudioEnabled
                ? 'bg-gray-700/80 hover:bg-gray-600 text-white shadow-lg'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20'
            }`}
            title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {isAudioEnabled ? 'Mute' : 'Unmute'}
            </span>
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`group relative p-4 rounded-2xl transition-all transform hover:scale-105 ${
              isScreenSharing
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-700/80 hover:bg-gray-600 text-white shadow-lg'
            }`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {isScreenSharing ? 'Stop share' : 'Share screen'}
            </span>
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="group relative p-4 rounded-2xl bg-gray-700/80 hover:bg-gray-600 text-white transition-all transform hover:scale-105 shadow-lg"
            title="Toggle chat"
          >
            <MessageSquare className="w-6 h-6" />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                {messages.length}
              </span>
            )}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Chat
            </span>
          </button>

          {/* Spacer */}
          <div className="w-px h-12 bg-gray-700 mx-2"></div>

          {/* Leave Call */}
          <button
            onClick={handleLeave}
            className="group relative p-4 px-8 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all transform hover:scale-105 shadow-lg shadow-red-500/20 flex items-center gap-2"
            title="Leave interview"
          >
            <PhoneOff className="w-6 h-6" />
            <span className="font-semibold">Leave</span>
          </button>
        </div>
      </div>

      {/* Chat Panel - Enhanced */}
      {showChat && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-l border-gray-700/50 flex flex-col z-50 shadow-2xl">
          {/* Chat Header */}
          <div className="p-5 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Chat</h3>
                  <p className="text-gray-400 text-xs">{messages.length} messages</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)} 
                className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${msg.userId === userId ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl p-3 shadow-lg ${
                      msg.userId === userId 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                        : 'bg-gray-700/80 backdrop-blur-sm text-gray-100 border border-gray-600/50'
                    }`}>
                      <p className="text-sm break-words">{msg.message}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 px-2 ${msg.userId === userId ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatMessage.trim()}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
