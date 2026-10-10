import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

interface PresenceUser {
  id: string;
  name: string;
  color: string;
}

@WebSocketGateway({ cors: true, namespace: "/collaboration" })
export class CollaborationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly roomUsers = new Map<string, PresenceUser[]>();

  handleConnection(): void {}

  handleDisconnect(client: Socket): void {
    for (const [roomId, users] of this.roomUsers) {
      const filtered = users.filter((item) => item.id !== client.id);
      this.roomUsers.set(roomId, filtered);
      this.server.to(roomId).emit("presence", { collaborators: filtered });
    }
  }

  @SubscribeMessage("join-room")
  joinRoom(client: Socket, @MessageBody() fileId: string) {
    client.join(fileId);
    const users = this.roomUsers.get(fileId) ?? [];
    const nextUsers = [
      ...users,
      {
        id: client.id,
        name: `User-${client.id.slice(0, 4)}`,
        color: "#0EA5E9",
      },
    ];
    this.roomUsers.set(fileId, nextUsers);
    this.server.to(fileId).emit("presence", { collaborators: nextUsers });
  }

  @SubscribeMessage("leave-room")
  leaveRoom(client: Socket, @MessageBody() fileId: string) {
    client.leave(fileId);
    const users = (this.roomUsers.get(fileId) ?? []).filter((item) => item.id !== client.id);
    this.roomUsers.set(fileId, users);
    this.server.to(fileId).emit("presence", { collaborators: users });
  }

  @SubscribeMessage("cursor-move")
  cursorMove(@MessageBody() body: { fileId: string; x: number; y: number }) {
    this.server.to(body.fileId).emit("cursor-move", body);
  }

  @SubscribeMessage("layer-select")
  layerSelect(@MessageBody() body: { fileId: string; layerId: string; userId: string }) {
    this.server.to(body.fileId).emit("layer-select", body);
  }

  emitParseProgress(fileId: string, progress: number, step: string) {
    this.server.to(fileId).emit("parse-progress", { fileId, progress, step });
  }
}
