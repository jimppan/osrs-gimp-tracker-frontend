import { ConnectPlayer, DisconnectPlayer, GetPlayer } from './world.js'
import { TILE_SIZE } from './world.js'

SOCKET = io.connect('backend-ip', {query:{system:'frontend'}}); // make the backend know we're sending communicating from frontend

SOCKET.on('connect', () => 
{
    SOCKET.on('disconnect', ()=>
    {
        console.log("Disconnected");
    })

    // Client joins the map
    SOCKET.on('BEND_CLIENT_JOIN', ({name, pos}) =>
    {
        console.log("BEND_CLIENT_JOIN - ", name);
        ConnectPlayer(name, pos);
    });

    // Client gets updated
    SOCKET.on('BEND_CLIENT_UPDATE', ({name, pos}) =>
    {
        console.log("BEND_CLIENT_UPDATE - ", name);
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
    SOCKET.on('BEND_CLIENT_DISCONNECT', ({name}) =>
    {
        console.log("BEND_CLIENT_DISCONNECT - ", name);
        DisconnectPlayer(name);
    });


    console.log("Connected")
});