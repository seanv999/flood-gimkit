const apiInfo = {
    infoFromCode:'https://www.gimkit.com/api/matchmaker/find-info-from-code',
    matchMaker:'https://www.gimkit.com/api/matchmaker/join'
};

const findRoom = async roomCode => {
    const r = await fetch(apiInfo.infoFromCode,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "code": String(roomCode),
        })
    });
    return r.json();
};

const getIntent = async (n, c) => {
    const roomId = await findRoom(c);
    const r = await fetch(apiInfo.matchMaker,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "roomId": roomId.roomId,
            "name": n,
            "clientType": `Gimkit ⁡‍⁤‍⁡‌‍⁢‍⁢‍⁡‌‍⁢⁡⁤‍‍‍⁡⁢‍⁢⁡‍‌‍‌‍⁡⁡⁡‍‍‌⁢⁡⁢⁡⁡⁡‍⁣‌‍‌⁡⁤‍‌‍⁡⁤⁡⁢⁡⁢⁡‍⁢‍‍⁢⁣⁡‌⁢‍⁣‌⁡‍⁣⁡‌⁡⁡⁢‍‌⁤⁢‍‌⁢⁡‍⁡⁡‍⁢‍⁢‌⁡⁢⁣⁡‌⁡⁤‍⁡⁡‌‍⁢⁣⁢⁡‍⁡⁣‍‍⁢⁡⁡‍‍⁡‌⁤⁡‌⁢⁡⁢‍⁡‌‍⁢‌⁢⁡‍‌⁢⁡⁢‌⁡‌⁢‍‍‍⁡⁣⁢‍‌‍⁡‍‌⁢‌⁢⁡⁡‌⁢⁣‌⁤⁢⁡‍‍⁡‍⁢⁡⁢⁡⁣⁡‌⁡‍⁡⁡⁣‍⁤⁢⁡⁢‍⁡⁤‌⁡⁤‌⁡⁡‍‍‍‍‍‌⁢⁡⁡‍‍⁢‌‍‌‍⁢‍⁢⁡⁡⁢⁡‌⁡‌⁡⁡‌‍⁡⁢‍‌⁡⁢‌‍⁣‍‌⁤⁡⁡‍⁡‍⁢‍⁣‍⁣⁤‌‍‍⁣⁡‌‍‌⁡⁢⁡⁤‍⁤⁡⁢⁡‌‍⁡⁢‍‍‍‌‍‍‌⁢‍⁢‍⁢‌⁡‍‌⁡‌⁤‍⁡Web Client V3.1`
        })
    });
    return r.json();
}

const join = async(c, p)  => {
    const r = await getIntent(p, c)

    const server = `${r.serverUrl}/matchmake/joinById/${r.roomId}`
    
    const room = await fetch(server,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "intentId": r.intentId
        })
    })
    const roomData = await room.json();
    //socket
    const httpToWss = r.serverUrl.replace('https', 'wss');
    const processId = roomData.room.processId;
    const roomId = roomData.room.roomId;
    const sessionId = roomData.sessionId;

    const socketUri = `${httpToWss}/${processId}/${roomId}?sessionId=${sessionId}`;
    const socket = new WebSocket(socketUri);
    
    socket.addEventListener('open', () => {
        return true;
    });

};

(async G =>{
    const n = prompt('Names');
    const a = prompt('Amount');
    const p = prompt('Pin');
    for(i=0;i<a;i++){
        await join(p, n)
    };
})()
