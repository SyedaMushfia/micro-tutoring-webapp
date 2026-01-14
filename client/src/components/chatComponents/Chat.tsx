import React, { useEffect, useRef, useState } from 'react'
import PhotoIcon from '@mui/icons-material/Photo';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';
import { socket } from '../../utils';
import axios from 'axios';
import EmojiPicker from "emoji-picker-react";
import { useAppContext } from '../../context/AppContext';

interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  role: 'student' | 'tutor';
  profilePicture?: string;
}

interface ChatProps {
  sessionId: string | undefined;
  userData: User;
  otherUser: { 
    name: string; 
    profilePicture: string;
    online: boolean},
  isRecorded?: boolean;
}

interface Message {
  senderName: string;
  senderId: string;
  message: string;
  image?: string;
  createdAt: string;
}

function Chat({ sessionId , userData, otherUser, isRecorded}: ChatProps) {
  const { backendUrl } = useAppContext()
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!sessionId || !userData) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/session/${sessionId}/messages`, { withCredentials: true });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    if (!isRecorded) {
    socket.emit("join-session", { sessionId, userId: userData._id });

    socket.on("receive-message", (message: Message) => {
      setMessages(prev => [...prev, message]);
      });

    return () => {
      socket.off("receive-message");
    };
  }
  }, [sessionId, userData, isRecorded])

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    let imageUrl = null;

    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        const res = await axios.post("http://localhost:4000/api/chat/upload-image", formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" }});
        imageUrl = res.data.imageUrl;
      } catch (error) {
        console.error("Image upload failed", error)
      }
    }

    socket.emit("send-message", {sessionId, senderId: userData._id, senderName: `${userData.firstName} ${userData.lastName}`, message: newMessage, image: imageUrl});
    
    setNewMessage("");
    setSelectedImage(null);
    setPreviewUrl(null);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };


  const handleEndSession = () => {
    socket.emit("end-session", {sessionId});
  }

  return (
    <div className='md:min-w-[35vw] md:w-[35vw] h-[690px] bg-slate-200 flex flex-col md:border-r-[1px] md:border-r-[#cac9c9]'>
      <div className='flex justify-between items-center py-2 lg:px-8 md:px-4 sm:px-8 xs:px-6 bg-white drop-shadow-xl '>
        <div className='flex items-center lg:gap-4 md:gap-2 sm:gap-4 xs:gap-4'>
            <div className="w-[3.25vw] h-[3.25vw] rounded-full overflow-hidden">
                <img src={otherUser.profilePicture} alt="profile picture" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className='text-[#2e294e] md:text-text5'>{otherUser.name}</p>
              {!isRecorded && <div className='flex items-baseline gap-2'>
                <CircleIcon className='!text-[10px] text-green-600'/>
                <p className='text-[#555] md:text-text5'>{otherUser.online ? "Online" : "Offline"}</p>
              </div>}
            </div>
        </div>
        {!isRecorded && <button onClick={handleEndSession} className='lg:text-[14px] md:text-[12px] xs:text-[14px] font-semibold bg-[#d8d2ff] shadow-md rounded-xl text-[#2e294e] h-[40px] lg:w-[7.5vw] md:w-[35vw] sm:w-[40vw] xs:w-[66vw] px-2 hover:bg-[#d1e674]'>End Session</button>}
      </div>
      {/* <div className='bg-pink-200 h-[580px]'> */}
        <div className='flex-1 custom-scrollbar overflow-y-auto min-h-[540px] p-4 bg-slate-200'>
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.senderId === userData._id ? 'items-end' : 'items-start'} mb-4`}>
              {msg.message && <p className={`inline-block p-2 rounded-xl break-words max-w-[50%] ${msg.senderId === userData._id ? 'bg-[#d8d2ff]' : 'bg-white'}`}>{msg.message}</p>}
              {msg.image && (
                <img
                  src={msg.image}
                  className="max-w-[220px] rounded-xl mt-1"
                  alt="chat"
                />
              )}
              <p className='text-xs mt-[3px] text-gray-500'>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          ))}
          <div ref={scrollRef} />
        {/* </div> */}

      </div>
        {!isRecorded && <div className='bg-white rounded-full my-2 mx-2 h-[68px] flex items-center px-6 gap-4'>
          <div className='flex items-center gap-4 text-[#555]'>
            {previewUrl ? (
              <div className='w-10 h-10'>
                <img src={previewUrl} alt="preview" className='w-full h-full object-cover rounded-xl' />
              </div>
              ): (
              <div>
                <PhotoIcon onClick={() => fileInputRef.current?.click()} className='!text-[30px] text-[#8a8a8a] cursor-pointer'/>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>)}
            <EmojiEmotionsIcon className='!text-[30px] text-[#8a8a8a] cursor-pointer' onClick={() => setShowEmoji(prev => !prev)}/>
            {showEmoji && (
              <div className="absolute bottom-[80px] left-6 z-50">
              <EmojiPicker
                onEmojiClick={(emoji) =>
                  setNewMessage(prev => prev + emoji.emoji)
                }
              />
            </div>
            )}
          </div>
          <textarea
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className='h-[75%] w-[80%] appearance-none resize-none rounded-xl p-2 focus:border-[1px] focus:border-[#675cae] focus:ring-[1px] focus:ring-[#675cae] focus:outline-none transition-all'
            placeholder="Write a message..."
          />          
        <SendIcon onClick={handleSendMessage} className='!text-[30px] text-[#8a8a8a] cursor-pointer'/>
        </div>}
    </div>
  )
}

export default Chat
