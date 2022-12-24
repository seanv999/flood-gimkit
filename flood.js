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

//create GUI
const gui = document.createElement('div');
gui.id = 'gui';
gui.innerHTML = `
    <h1 id="title">Gimshit</h1>
    <div id="inputs">
        <input placeholder="Pin" id="code"></input>
        <input placeholder="Names" id="names"></input>
        <input type="number" maxlength="100" placeholder="Amount" id="amount" ></input>
        <button id="floodButton">Flood</button>
    </div>
`;
document.body.append(gui);

//Styles
const style = document.createElement('style');
style.innerText = `#gui,#inputs{position:absolute}#inputs>button,#title{-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent;--antd-wave-shadow-color:#1890ff;--scroll-bar:0;font-feature-settings:"tnum","tnum";font-variant:normal!important;overflow-wrap:break-word;box-sizing:border-box}#gui{width:21rem;height:21rem;border:.2rem solid #0f2c65;border-radius:.2rem;z-index:9;box-shadow:2px 4px 18px rgba(0,0,0,.2);transition:border-color .2s,box-shadow .2s;top:30%;left:40%;background-color:#fff}::placeholder{text-align:center;font-size:large}#title{font-family:GimkitSF,sans-serif;color:#000;font-size:20px;font-weight:800;line-height:1;display:flex;justify-content:center;margin-top:10%}#inputs{margin:0;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:-999999}#inputs>input{display:flex;align-self:center;padding:0;border:2px solid GREY;outline:0;margin-top:5px;border-radius:5px;font-size:15px;z-index:999999}#inputs>button{line-height:1.5;font-family:"Product Sans";padding:8px 13px;font-size:12px;background:#1e076b;color:#fff;transition:background .2s;border-radius:7px;font-weight:700;text-align:center;display:inline-block;user-select:none;cursor:pointer;margin:3% auto auto;width:50%}`;
document.head.appendChild(style);

//flood Button
const flood = document.getElementById('floodButton');
flood.addEventListener('click', async e => {
    const name = document.getElementById('names').value;
    const amount = document.getElementById('amount').value;
    const pin = document.getElementById('code').value;

    gui.remove();
    for(i=0;i<amount;i++){
        await join(pin, name)
    };
})
