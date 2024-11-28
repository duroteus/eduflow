import amqp, { ConsumeMessage } from "amqplib";
import { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";

const createMockReqRes = (data: any) => {
  let responseData: any = null;

  const req = {
    body: data,
    params: data.params || {},
    query: data.query || {},
  } as unknown as Request;

  const res = {
    status: (code: number) => res,
    json: (data: any) => {
      responseData = data;
      return res;
    },
    send: () => res,
  } as unknown as Response;

  return { req, res, getResponse: () => responseData };
};

export class MessageService {
  private connection?: amqp.Connection;
  private channel?: amqp.Channel;
  private controller: UserController;

  constructor() {
    this.controller = new UserController();
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL!);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue("user_requests", { durable: true });
      await this.channel.assertQueue("user_responses", { durable: true });

      console.log("[UserService] Connected to RabbitMQ");
      console.log("[UserService] Waiting for messages...");

      this.channel.consume(
        "user_requests",
        async (msg: ConsumeMessage | null) => {
          if (!msg) return;

          try {
            console.log(
              "[UserService] Received message:",
              msg.content.toString()
            );
            const { action, data } = JSON.parse(msg.content.toString());
            let response;

            switch (action) {
              case "user/create": {
                const mockReq = createMockReqRes(data);
                await this.controller.create(mockReq.req, mockReq.res);
                response = mockReq.getResponse();
                break;
              }
              case "user/signin": {
                console.log("[MessageService] Processing signin:", data);
                const mockReq = createMockReqRes(data);
                await this.controller.signin(mockReq.req, mockReq.res);
                response = mockReq.getResponse();
                console.log("[MessageService] Signin response:", response);
                break;
              }
              case "user/list": {
                const mockReq = createMockReqRes({
                  ...data,
                  query: { role: data.role },
                });
                await this.controller.list(mockReq.req, mockReq.res);
                response = mockReq.getResponse();
                break;
              }
              default:
                console.log("[UserService] Unknown action:", action);
                response = { error: "Unknown action" };
            }

            console.log("[UserService] Sending response:", response);
            this.channel!.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(
                JSON.stringify(response || { error: "No response generated" })
              ),
              {
                correlationId: msg.properties.correlationId,
              }
            );

            this.channel!.ack(msg);
          } catch (error) {
            console.error("[UserService] Error processing message:", error);
            this.channel!.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(
                JSON.stringify({
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                })
              ),
              {
                correlationId: msg.properties.correlationId,
              }
            );
            this.channel!.ack(msg);
          }
        },
        { noAck: false }
      );

      return;
    } catch (error) {
      console.error("[UserService] Connection error:", error);
      throw error;
    }
  }
}
