import amqp, { ConsumeMessage } from "amqplib";
import { Request, Response } from "express";
import { NotificationController } from "../controllers/notification.controller";

const createMockReqRes = (data: any) => {
  let responseData: any = null;

  const req = {
    body: data,
    params: data.params || {},
    query: data.query || {},
  } as unknown as Request;

  const res = {
    status: () => res,
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
  private controller: NotificationController;

  constructor() {
    this.controller = new NotificationController();
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL!);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue("notification_requests", {
        durable: true,
      });
      console.log("[NotificationService] Connected to RabbitMQ");

      if (!this.channel) return;

      this.channel.consume(
        "notification_requests",
        async (msg: ConsumeMessage | null) => {
          if (!msg || !this.channel) return;

          try {
            const { action, data } = JSON.parse(msg.content.toString());
            console.log("[NotificationService] Received message:", {
              action,
              data,
              replyTo: msg.properties.replyTo,
            });

            let response;
            switch (action) {
              case "notification/list": {
                const mockReq = createMockReqRes({
                  query: { userId: data.userId },
                });
                await this.controller.list(mockReq.req, mockReq.res);
                response = mockReq.getResponse();
                break;
              }
            }

            if (msg.properties.replyTo && this.channel) {
              console.log("[NotificationService] Sending response:", response);
              this.channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(response || [])),
                {
                  correlationId: msg.properties.correlationId,
                }
              );
            }

            this.channel.ack(msg);
          } catch (error) {
            console.error(
              "[NotificationService] Error processing message:",
              error
            );
            this.channel.ack(msg);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.error("[NotificationService] Connection error:", error);
      throw error;
    }
  }
}
