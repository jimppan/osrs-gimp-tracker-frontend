import { DeleteObject } from './object.js';
import { ConnectPlayer, GetPlayer, DisconnectPlayer, IsValidPacket } from './player.js'

const CURRENT_SYSTEM = 'frontend'

const SocketEvent = 
{
    JOIN: 'BEND_CLIENT_JOIN',
    UPDATE: 'BEND_CLIENT_UPDATE',
    DISCONNECT: 'BEND_CLIENT_DISCONNECT',
}

export function ConnectToBackend()
{
    SOCKET = io.connect(CONFIG_BACKEND_URL, {query:{system:CURRENT_SYSTEM}}); // make the backend know we're sending communicating from frontend
    var ADDED_LISTENERS = false;
    
    SOCKET.on('connect', () => 
    {
        // clear map once we connect, so any previous data is wiped
    
        if(ADDED_LISTENERS)
            return;
        ADDED_LISTENERS = true;
        SOCKET.on('disconnect', ()=>
        {
            console.log("Lost connection to backend");
            // clear all networked actors so we dont manage to get duplicates
            ClearNetworkedActors();
        })
    
        // Client joins the map
        SOCKET.on(SocketEvent.JOIN, (packet) =>
        {
            var player = GetPlayer(name);
            if(player == null)
                ConnectPlayer(packet);
        });
    
        // Client gets updated
        SOCKET.on(SocketEvent.UPDATE, (packet) =>
        {
            if(!IsValidPacket(packet))
                return;
    
            //console.log(SocketEvent.UPDATE, ": ", name);
            var player = GetPlayer(packet.name);
            if(player == null)
                player = ConnectPlayer(packet);
            else
            {
                // update state
                player.parsePacket(packet, false)
            }
        });
    
        // Client leaves (Closes runelite or DCs intentionally)
        SOCKET.on(SocketEvent.DISCONNECT, ({name}) =>
        {
            DisconnectPlayer(name);
        });
    
    
        console.log("Connected to backend")
    });
}

// for now its just players
function ClearNetworkedActors()
{
    for (let [key, value] of PLAYERS) 
        DeleteObject(value);

    for (let [key, value] of PLAYERS) 
        PLAYERS.delete(key);
}