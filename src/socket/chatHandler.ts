import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

// {'to':destination user id,
// 'message': message to send}
export = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {

    const sendMessage = (payload) => {
        console.log('chat:send_message')
        const to = payload.to
        const message = payload.message
        const from = socket.data.user

        io.to(to).emit("chat:message", { 'to': to, 'from': from, 'message': message })
    }

    console.log('register echo handlers')
    socket.on("chat:send_message", sendMessage)
}