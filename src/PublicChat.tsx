import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Message } from "./types/types";
import { Socket } from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";

interface props {
  chatName:string
  socket: Socket;
  userName: string;
  chooseChat: (chatName: string) => void;
}

const PublicChat = ({ socket, userName, chooseChat,chatName }: props) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  useEffect(() => {
      socket.emit(
        "fetch_msgs",
        JSON.stringify({ chatName:null })
      );
  if(socket.listeners("public_msgs").length!==0){
    socket.removeListener('public_msgs')}
    socket.on("public_msgs", (msg) => {
      const data: Message[] = JSON.parse(msg).data;
      setChatMessages(data);
    });
  
  if(socket.listeners("msg_public").length!==0){
    socket.removeListener('msg_public')}
    socket.on("msg_public", (msg) => {
      const data: Message = JSON.parse(msg);
      
      if (data.toUser === "") {
        setChatMessages((prev)=>[...prev,data]);
      }
    });
  

  if(socket.listeners("delete_public").length!==0){
    socket.removeListener('delete_public')}
    socket.on('delete_public',(msg)=>{
      const id = (JSON.parse(msg)).msgId
      setChatMessages((prev)=>{
        const res = prev.filter((msg)=>msg.id!==id)
        return res
      })
    })
  
  if(socket.listeners("msg_ack_public").length!==0){
    socket.removeListener('msg_ack_public')}
    socket.on("msg_ack_public", async (msgId) => {
      setChatMessages((prev) => {
        const res = prev;
        const msg = res.pop();
        if (msg) {
          msg.id = JSON.parse(msgId).messageId;
          res.push(msg);
        }
        return res;
      });
    });
  
  }, [chatName]);



  function deleteMsg(id: string) {
    const msg = { msgId: id, msgType: "public" };
    socket.emit("delete", JSON.stringify(msg));
    setChatMessages((prev) => {
      const res = prev.filter((msg) => msg.id !== id);
      return res;
    });
  }

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const handleSendMessage = () => {
    if (!socket.connected) {
      console.log("not connected");
      return;
    }
    if (messageText.trim() !== "") {
      const time = new Date()
      const msg: Message = { toUser: "", content: messageText, from: userName,timestamp:time.toString() };
      setChatMessages((prev) => [...prev, msg]);
      socket.emit("msg", JSON.stringify(msg));
      setMessageText("");
    }
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {chatMessages.length > 0
        ? chatMessages.map((msg, i) => {
          const time:string|null =msg.timestamp? new Date(msg.timestamp).toLocaleTimeString():null
            return (
              <Box key={i}>
                <Box
                  sx={{
                    borderColor: "Background",
                    width: "auto",
                    float: msg.from && msg.from === userName ? "right" : "left",
                    mb: 3,
                    p: 1,
                    backgroundColor: "#a8ebd4",
                    borderTopLeftRadius: msg.from === userName ? "12%" : null,
                    borderBottomLeftRadius:
                      msg.from === userName ? "12%" : null,
                    borderTopRightRadius: msg.from !== userName ? "12%" : null,
                    borderBottomRightRadius:
                      msg.from !== userName ? "12%" : null,
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <IconButton
                    disabled={msg.from===userName}
                      sx={{
                        "&:hover": {
                          backgroundColor: "transparent", // Remove background color on hover
                        },
                        "& .MuiTouchRipple-root": {
                          display: "none", // Hide the touch ripple effect
                        },
                      }}
                      onDoubleClick={() => {
                        if (msg.from) chooseChat(msg.from);
                      }}
                    >
                      <Typography
                        sx={{ mb: 1, lineHeight: 0.5 }}
                        fontSize={"small"}
                      >
                        {msg.from !== userName ? msg.from : "you"}
                      </Typography>
                    </IconButton>
                    {msg.from && msg.from === userName ? (
                      <Button
                        onClick={() => {
                          if (msg.id) {
                            deleteMsg(msg.id);
                          }
                        }}
                      >
                        <ClearTwoToneIcon
                          sx={{ height: 10, width: 10, ml: 4 }}
                        />
                      </Button>
                    ) : null}
                  </Box>
                  <Typography>{msg.content}</Typography>
                  <Typography fontSize={'x-small'}>{time}</Typography>
                </Box>
              </Box>
            );
          })
        : null}
      <Box sx={{ ml: "40%" }}>
        <TextField
          onChange={handleMessageChange}
          value={messageText}
          id="input message"
          label=""
          variant="outlined"
        />
        <Button sx={{ mt: 1 }} onClick={handleSendMessage}>
          <SendIcon />
        </Button>
      </Box>
    </Container>
  );
};

export default PublicChat;
