(async()=>{
    const api = {
        a:'https://www.gimkit.com/api/matchmaker/find-info-from-code',
        b:'https://www.gimkit.com/api/matchmaker/join'
    };
    
    const findRoom = async c => {
        const r = await fetch(api.a, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "code": String(c),
            })
        }).catch(e => {
            console.log(e)
        })
        return r.json();
    };
    
    const getIntent = async n => {
        const r = await fetch(api.b,{
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "roomId": window.roomID.roomId,
                "name": n,
                "clientType": `Gimkit ⁡‍⁤‍⁡‌‍⁢‍⁢‍⁡‌‍⁢⁡⁤‍‍‍⁡⁢‍⁢⁡‍‌‍‌‍⁡⁡⁡‍‍‌⁢⁡⁢⁡⁡⁡‍⁣‌‍‌⁡⁤‍‌‍⁡⁤⁡⁢⁡⁢⁡‍⁢‍‍⁢⁣⁡‌⁢‍⁣‌⁡‍⁣⁡‌⁡⁡⁢‍‌⁤⁢‍‌⁢⁡‍⁡⁡‍⁢‍⁢‌⁡⁢⁣⁡‌⁡⁤‍⁡⁡‌‍⁢⁣⁢⁡‍⁡⁣‍‍⁢⁡⁡‍‍⁡‌⁤⁡‌⁢⁡⁢‍⁡‌‍⁢‌⁢⁡‍‌⁢⁡⁢‌⁡‌⁢‍‍‍⁡⁣⁢‍‌‍⁡‍‌⁢‌⁢⁡⁡‌⁢⁣‌⁤⁢⁡‍‍⁡‍⁢⁡⁢⁡⁣⁡‌⁡‍⁡⁡⁣‍⁤⁢⁡⁢‍⁡⁤‌⁡⁤‌⁡⁡‍‍‍‍‍‌⁢⁡⁡‍‍⁢‌‍‌‍⁢‍⁢⁡⁡⁢⁡‌⁡‌⁡⁡‌‍⁡⁢‍‌⁡⁢‌‍⁣‍‌⁤⁡⁡‍⁡‍⁢‍⁣‍⁣⁤‌‍‍⁣⁡‌‍‌⁡⁢⁡⁤‍⁤⁡⁢⁡‌‍⁡⁢‍‍‍‌‍‍‌⁢‍⁢‍⁢‌⁡‍‌⁡‌⁤‍⁡Web Client V3.1`
            })
        }).catch(e => {
            console.log(e)
            return false
        })
        return r.json();
    }
    
    const join = async p => {
        //get session details
        const r = await getIntent(p)
        const s = `${r.serverUrl}/matchmake/joinById/${r.roomId}`
        const d = await fetch(s, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "intentId": r.intentId
            })
        }).catch( e => {
            console.log(e)
            return 0
        })
        const rd = await d.json();
    
        //socket
        const wss = r.serverUrl.replace('https', 'wss');
        const url = `${wss}/${rd.room.processId}/${rd.room.roomId}?sessionId=${rd.sessionId}`;
        const socket = new WebSocket(url);
        return 1
    };
    
    //create GUI
    const gui = document.createElement('div');
    gui.id = 'gui';
    gui.innerHTML = `<h1 id="title">Gimshit</h1><div id="inputs"><input placeholder="Pin" id="code"></input><input placeholder="Names" id="names"></input><input type="number" maxlength="100" placeholder="Amount" id="amount" ></input><button id="floodButton">Flood</button></div>`;
    document.body.append(gui);
    
    //Styles
    const style = document.createElement('style');
    style.innerText = `#gui,#inputs{position:absolute}#inputs>button,#title{-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent;--antd-wave-shadow-color:#1890ff;--scroll-bar:0;font-feature-settings:"tnum","tnum";font-variant:normal!important;overflow-wrap:break-word;box-sizing:border-box}#gui{width:21rem;height:21rem;border:.2rem solid #0f2c65;border-radius:.2rem;z-index:9;box-shadow:2px 4px 18px rgba(0,0,0,.2);transition:border-color .2s,box-shadow .2s;top:30%;left:40%;background-color:#fff}::placeholder{text-align:center;font-size:large}#title{font-family:GimkitSF,sans-serif;color:#000;font-size:20px;font-weight:800;line-height:1;display:flex;justify-content:center;margin-top:10%}#inputs{margin:0;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:-999999}#inputs>input{display:flex;align-self:center;padding:0;border:2px solid GREY;outline:0;margin-top:5px;border-radius:5px;font-size:15px;z-index:999999}#inputs>button{line-height:1.5;font-family:"Product Sans";padding:8px 13px;font-size:12px;background:#1e076b;color:#fff;transition:background .2s;border-radius:7px;font-weight:700;text-align:center;display:inline-block;user-select:none;cursor:pointer;margin:3% auto auto;width:50%}`;
    document.head.appendChild(style);
    
    const flood = async () => {
        const name = document.getElementById('names').value;
        const amount = document.getElementById('amount').value;
        const pin = document.getElementById('code').value;
        window.roomID = await findRoom(pin);
        if( window.roomID.code == 404){
            gui.remove();
            alert('Room Not Found')
            return 0
        }
        gui.remove();
        for(i=0;i<amount;i++){
            await join(name)
        };
    }
    //flood Button
    const f = document.getElementById('floodButton');
    f.onclick = flood
})()
