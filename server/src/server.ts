// src/server.ts
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow CORS for all origins
  },
});

// In-memory rate limiter
const rateLimit = new Map<
  string,
  { lastTyping: number; typingCount: number }
>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_TYPING_EVENTS = 1000; // Max 1000 typing events per window

const isRateLimited = (socketId: string) => {
  const currentTime = Date.now();
  const userLimit = rateLimit.get(socketId);

  if (!userLimit) {
    rateLimit.set(socketId, { lastTyping: currentTime, typingCount: 1 });
    return false;
  }

  const { lastTyping, typingCount } = userLimit;

  if (currentTime - lastTyping > RATE_LIMIT_WINDOW_MS) {
    rateLimit.set(socketId, { lastTyping: currentTime, typingCount: 1 });
    return false;
  }

  if (typingCount < RATE_LIMIT_MAX_TYPING_EVENTS) {
    rateLimit.set(socketId, {
      lastTyping: currentTime,
      typingCount: typingCount + 1,
    });
    return false;
  }

  return true;
};

io.on("connection", (socket: Socket) => {
  console.log("a user connected:", socket.id);

  socket.on("typing", (data) => {
    if (isRateLimited(socket.id)) {
      socket.emit(
        "error",
        "Rate limit exceeded. Please wait before sending more typing notifications."
      );
      return;
    }

    if (typeof data.text !== "string" || data.text.length > 100) {
      socket.emit("error", "Invalid typing content.");
      return;
    }

    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`);
});