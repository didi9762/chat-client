import { Box, Container, IconButton, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import io, { Socket } from "socket.io-client";
import MainPage from "./mainPage";
import LoginIcon from '@mui/icons-material/Login';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userName, setUserName] = useState("");
  const [login, setLogin] = useState(false);



  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  function handleLogin(){
    if(!userName)return
    if (!socket) {
      const sock: Socket = io(`http://localhost:8080`, {
        query: {
          userName:userName,
        },
      });
      sock.on("connected", () => {
        console.log("Connection established");
        setLogin(true)
      });
      sock.on('disconnected',()=>{
        console.log('connection closed');
        
      })
      setSocket(sock);
    }
  }

  return (
    <Container sx={{height:'100vh'}}>
      {(!login || !userName) && (
        <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
          <TextField label='enter usr name' onChange={handleTextChange} />
          <IconButton onClick={handleLogin}><LoginIcon/></IconButton>
        </Box>
      )}
      {socket&&userName ? <MainPage socket={socket} userName={userName} /> : null}
    </Container>
  );
}
export default App;
