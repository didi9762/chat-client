import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '15%',
  left: '10%',
  transform: 'translate(-50%, -50%)',
  width: '10%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  display:'flex',
  flexDirection:'column',
  p:2
};

interface params{
    chats:string[]
    chooseChat:(chat:string)=>void
    open:boolean
    toggleMenu:()=>void
}

export default function ChatsModal({chats,chooseChat,open,toggleMenu}:params) {

  return (
    <div>
      <Modal
        open={open}
        onClose={toggleMenu}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography sx={{textAlign:'center',mb:2}}>All chats</Typography>
            {chats.map((ch,i)=>{
                return(
                    <Button sx={{mb:1}} variant='outlined' key={i} onClick={()=>{chooseChat(ch);toggleMenu()}} >{ch}</Button>
                )
            })}
        </Box>
      </Modal>
    </div>
  );
}