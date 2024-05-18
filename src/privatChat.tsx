import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Message } from "./types/types";
import { Socket } from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";

interface props {
  chatName: string;
  socket: Socket;
  userName: string;
}

const PrivatChat = ({ chatName, socket, userName }: props) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  useEffect(() => {
      socket.emit(
        "fetch_msgs",
        JSON.stringify({index:0, chatName: chatName })
      );
    if (socket.listeners("privat_msgs").length !== 0) {
      socket.removeListener("public_msgs")}
      socket.on("privat_msgs", (msg) => {
        const data: Message[] = JSON.parse(msg).data;
        setChatMessages(data);
      });
      if (socket.listeners("msg").length !== 0) {
        socket.removeListener("msg");}
        socket.on("msg", (msg) => {
          const data: Message = JSON.parse(msg);
          if (data.toUser === chatName || data.from === chatName) {
            setChatMessages((prev) => [...prev, data]);
          }
        });
    if (socket.listeners("msg_ack").length !== 0) {
      socket.removeListener("msg_ack");}
      socket.on("msg_ack", async (msgId) => {
        setChatMessages((prev) => {
          const res = prev;
          const msg = res.pop();
          if (msg) {
            msg.id = JSON.parse(msgId).messageId;
            msg.from = JSON.parse(msgId).from;
            res.push(msg);
          }
          return res;
        });
      });

    if (socket.listeners("delete").length !== 0) {
      socket.removeListener("delete")}
      socket.on("delete", (msg) => {
        const id = JSON.parse(msg).msgId;
        setChatMessages((prev) => {
          const res = prev.filter((msg) => msg.id !== id);
          return res;
        });
      });
    
  }, [chatName]);

  function deleteMsg(id: string) {
    const msg = { msgId: id, msgType: "privat", toUser: chatName };
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
      const time = new Date();
      const msg: Message = {
        toUser: chatName,
        content: messageText,
        from: userName,
        timestamp: time.toString(),
      };
      setChatMessages((prev) => [...prev, msg]);
      socket.emit("msg", JSON.stringify(msg));
      setMessageText("");
    }
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {chatMessages.length > 0
        ? chatMessages.map((msg, i) => {
            const time: string | null = msg.timestamp
              ? new Date(msg.timestamp).toLocaleTimeString()
              : null;

            return (
              <Box key={i}>
                <Box
                  sx={{
                    borderColor: "Background",
                    width: "auto",
                    float: msg.toUser === chatName ? "right" : "left",
                    mb: 3,
                    backgroundColor: "#a8ebd4",
                    p: 2,
                    borderTopLeftRadius: msg.from === userName ? "12%" : null,
                    borderBottomLeftRadius:
                      msg.from === userName ? "12%" : null,
                    borderTopRightRadius: msg.from !== userName ? "12%" : null,
                    borderBottomRightRadius:
                      msg.from !== userName ? "12%" : null,
                  }}
                >
                  <Typography>{msg.content}</Typography>
                  <Typography fontSize={"x-small"}>{time}</Typography>
                  {msg.toUser === chatName ? (
                    <Button
                      onClick={() => {
                        if (msg.id) {
                          deleteMsg(msg.id);
                        }
                      }}
                    >
                      <ClearTwoToneIcon sx={{ height: 10, width: 10, ml: 4 }} />
                    </Button>
                  ) : null}
                </Box>
              </Box>
            );
          })
        : null}
      <Box sx={{ position: "fixed", bottom: 0, left: "40%", right: 0, mb: 3 }}>
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

export default PrivatChat;
