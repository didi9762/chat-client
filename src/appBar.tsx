import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChatsModal from './chatsModal';
import { useState } from 'react';

interface params{
    chat:string
    chatOptions:string[]
    chooseChat:(chat:string)=>void
}

export default function Header({chat,chatOptions,chooseChat}:params) {
const [open,setOpen] = useState(false)

const toggleMenu = ()=>setOpen(!open)

  return (
    <Box sx={{ flexGrow: 1,mb:3 }}>
      <AppBar position="static">
        <Toolbar >
          <IconButton
          onClick={toggleMenu}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {chat}
          </Typography>
        </Toolbar>
      </AppBar>
      <ChatsModal chats={chatOptions} chooseChat={chooseChat} open={open} toggleMenu={toggleMenu}/>
    </Box>
  );
}
