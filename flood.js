const apiInfo = {
    infoFromCode:'https://www.gimkit.com/api/matchmaker/find-info-from-code',
    matchMaker:'https://www.gimkit.com/api/matchmaker/join'
};

const findRoomInfo = async roomCode => {
    const res = await fetch(apiInfo.infoFromCode,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "code": String(roomCode),
        })
    });
    return res.json();
};

const getIntent = async (name, code) => {
    const roomId = await findRoomInfo(code);
    const res = await fetch(apiInfo.matchMaker,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "roomId": roomId.roomId,
            "name": name,
            "clientType": `Gimkit ⁡‍⁤‍⁡‌‍⁢‍⁢‍⁡‌‍⁢⁡⁤‍‍‍⁡⁢‍⁢⁡‍‌‍‌‍⁡⁡⁡‍‍‌⁢⁡⁢⁡⁡⁡‍⁣‌‍‌⁡⁤‍‌‍⁡⁤⁡⁢⁡⁢⁡‍⁢‍‍⁢⁣⁡‌⁢‍⁣‌⁡‍⁣⁡‌⁡⁡⁢‍‌⁤⁢‍‌⁢⁡‍⁡⁡‍⁢‍⁢‌⁡⁢⁣⁡‌⁡⁤‍⁡⁡‌‍⁢⁣⁢⁡‍⁡⁣‍‍⁢⁡⁡‍‍⁡‌⁤⁡‌⁢⁡⁢‍⁡‌‍⁢‌⁢⁡‍‌⁢⁡⁢‌⁡‌⁢‍‍‍⁡⁣⁢‍‌‍⁡‍‌⁢‌⁢⁡⁡‌⁢⁣‌⁤⁢⁡‍‍⁡‍⁢⁡⁢⁡⁣⁡‌⁡‍⁡⁡⁣‍⁤⁢⁡⁢‍⁡⁤‌⁡⁤‌⁡⁡‍‍‍‍‍‌⁢⁡⁡‍‍⁢‌‍‌‍⁢‍⁢⁡⁡⁢⁡‌⁡‌⁡⁡‌‍⁡⁢‍‌⁡⁢‌‍⁣‍‌⁤⁡⁡‍⁡‍⁢‍⁣‍⁣⁤‌‍‍⁣⁡‌‍‌⁡⁢⁡⁤‍⁤⁡⁢⁡‌‍⁡⁢‍‍‍‌‍‍‌⁢‍⁢‍⁢‌⁡‍‌⁡‌⁤‍⁡Web Client V3.1`
        })
    });
    return res.json();
}

const join = async(code, playerName)  => {
    //get intentID
    const r = await getIntent(playerName, code)

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
    const socketUri = `${r.serverUrl.replace('https', 'wss')}/${roomData.room.processId}/${roomData.room.roomId}?sessionId=${roomData.sessionId}`;
    const socket = new WebSocket(socketUri);

    socket.addEventListener('open', () => {
        return true;
    });
};

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

const style = document.createElement('style');
style.innerText = `
    #gui {
        width: 21rem;
        height: 21rem;
        border: 0.2rem solid #0f2c65;
        border-radius: 0.2rem;
        position: absolute;
        z-index: 9;
        box-shadow: 2px 4px 18px rgba(0, 0, 0, 0.2);
        transition: border-color 0.2s, box-shadow 0.2s;
        position: absolute;
        top: 30%;
        left: 40%;
        background-color: white;
    }
    ::placeholder {
        text-align: center;
        font-size: large;
    }
    #title{
        -webkit-text-size-adjust: 100%;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        --antd-wave-shadow-color: #1890ff;
        --scroll-bar: 0;
        font-feature-settings: "tnum","tnum";
        font-family: GimkitSF, sans-serif;
        color: rgb(0, 0, 0);
        font-variant: normal !important;
        box-sizing: border-box;
        overflow-wrap: break-word;
        font-size: 20px;
        font-weight: 800;
        line-height: 1;
        display: flex;
        justify-content: center;
        margin-top: 10%;
    }
    #inputs{
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: -999999;

    }

    #inputs>input{
        display: flex;
        align-self: center;
        padding: 0px;
        border: 2px solid GREY;
        outline: none;
        margin-top: 5px;
        border-radius: 5px;
        font-size: 15px;
        z-index: 999999;
    }
    #inputs>button{
        margin-top: 5px;
        -webkit-text-size-adjust: 100%;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        --antd-wave-shadow-color: #1890ff;
        --scroll-bar: 0;
        line-height: 1.5;
        font-feature-settings: "tnum","tnum";
        font-family: "Product Sans";
        font-variant: normal !important;
        overflow-wrap: break-word;
        box-sizing: border-box;
        padding: 8px 13px;
        font-size: 12px;
        background: rgb(30, 7, 107);
        color: white;
        transition: background 0.2s ease 0s;
        border-radius: 7px;
        font-weight: bold;
        text-align: center;
        display: inline-block;
        user-select: none;
        cursor: pointer;
        margin: auto;
        width: 50%;
        margin-top: 3%;
    }
`;
document.head.appendChild(style);


const flood = document.getElementById('floodButton');

flood.onclick = async ()=> {
    const name = document.getElementById('names').value;
    const amount = document.getElementById('amount').value;
    const pin = document.getElementById('code').value;
    gui.remove();
    for(i=0;i<amount;i++){
        await join(pin, name)
    };
};
