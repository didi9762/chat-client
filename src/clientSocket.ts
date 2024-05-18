// Replace 'yourTokenHere' with the actual token
const token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlck5hbWUiOiJKb2huX2RvZSIsImlhdCI6MTUxNjIzOTAyMn0.4ePGpZ25pvCkaostWZ1Du9bkembLyfoOtn7bN9759AE';
const ws: WebSocket = new WebSocket(`ws://localhost:8080/?token=${token}`);

ws.addEventListener('open', () => {
  console.log('Connection established');
  setTimeout(() => {
    // const message = { type: 'msg', content: 'hay ', toUser: 'moshe' }
    // const message = { type: 'delete', msgId: "0099697e-99a8-4b7e-88c3-db1e9fde55ef", msgType: 'public' }
    // const message = { type: 'fetch_msgs', index: 0 }
    const message = { type: 'fetch_my_chats' };
    ws.send(JSON.stringify(message));
  }, 3000);
});

ws.addEventListener('message', (data: MessageEvent) => {
  console.log(JSON.parse(data.toString()));
});

ws.addEventListener('close', (reason:CloseEvent) => {
  console.log('Connection closed:',reason);
});

