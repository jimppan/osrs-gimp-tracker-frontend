import { ConnectPlayer, DisconnectPlayer, GetPlayer } from './world.js'
import { TILE_SIZE } from './world.js'

const CURRENT_SYSTEM = 'frontend'

const SocketEvent = 
{
    JOIN: 'BEND_CLIENT_JOIN',
    UPDATE: 'BEND_CLIENT_UPDATE',
    DISCONNECT: 'BEND_CLIENT_DISCONNECT',
}

SOCKET = io.connect(CONFIG_BACKEND_URL, {query:{system:CURRENT_SYSTEM}}); // make the backend know we're sending communicating from frontend

SOCKET.on('connect', () => 
{
    SOCKET.on('disconnect', ()=>
    {
        console.log("Disconnected");
    })

    // Client joins the map
    SOCKET.on(SocketEvent.JOIN, ({name, pos}) =>
    {
        console.log(SocketEvent.JOIN, ": ", name);
        ConnectPlayer(name, pos);
    });

    // Client gets updated
    SOCKET.on(SocketEvent.UPDATE, ({name, pos}) =>
    {
        console.log(SocketEvent.UPDATE, ": ", name);
        var player = GetPlayer(name);
        if(player == null)
            player = ConnectPlayer(name, pos);
        else
        {
            // update state
            player.setPosition(pos.x * TILE_SIZE, pos.y * TILE_SIZE + TILE_SIZE);
        }
    });

    // Client leaves (Closes runelite or DCs intentionally)
    SOCKET.on(SocketEvent.DISCONNECT, ({name}) =>
    {
        console.log(SocketEvent.DISCONNECT, ": ", name);
        DisconnectPlayer(name);
    });


    console.log("Connected to backend")
});