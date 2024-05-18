import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import PrivatChat from "./privatChat"
import Header from "./appBar"
import PublicChat from "./PublicChat"

interface params {
    socket:Socket
    userName:string
}

const MainPage = ({socket,userName}:params)=>{
const [chatsNames,setChatsNames] = useState<string[]>([])
const [currentChat,setCurrentChat] = useState<string>('Public chat')

useEffect(()=>{
socket.on('chats_names',(msg)=>{
    const data = JSON.parse(msg)
    const allChats = data.data
    allChats.push('Public chat')
    setChatsNames(allChats)
})
if(chatsNames.length===0){
    socket.emit("fetch_my_chats")
}
},[])

const chooseChat = (chatName:string)=>{
    setCurrentChat(chatName)
}

    return (
        <Box>
            <Header chooseChat={chooseChat} chat={currentChat} chatOptions={chatsNames} />
            {currentChat==='Public chat'&&<PublicChat chatName={currentChat} chooseChat={chooseChat} userName={userName} socket={socket}/>}
            {currentChat!=='Public chat'&&<PrivatChat userName={userName} socket={socket} chatName={currentChat}/>}
        </Box>
    )
}

export default MainPage