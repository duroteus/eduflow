import amqp, { ConsumeMessage } from "amqplib";
import { Request, Response } from "express";
import { SubmissionController } from "../controllers/submission.controller";

interface MockReqRes {
  req: Request;
  res: Response;
  file?: Express.Multer.File;
  getResponse: () => any;
}

const createMockReqRes = (data: any): MockReqRes => {
  let responseData: any = null;

  const req = {
    body: data,
    params: data.params || {},
    query: data.query || data,
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
  private controller: SubmissionController;

  constructor(controller: SubmissionController) {
    this.controller = controller;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL!);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue("submission_requests", { durable: true });
      console.log("[SubmissionService] Connected to RabbitMQ");

      if (!this.channel) return;

      this.channel.consume(
        "submission_requests",
        async (msg: ConsumeMessage | null) => {
          if (!msg || !this.channel) return;

          try {
            const { action, data } = JSON.parse(msg.content.toString());
            console.log("[SubmissionService] Received message:", {
              action,
              data,
              replyTo: msg.properties.replyTo,
            });

            let response;
            switch (action) {
              case "submission/list": {
                const mockReq = createMockReqRes({
                  query: data,
                });
                await this.controller.list(mockReq.req, mockReq.res);
                response = mockReq.getResponse();
                break;
              }
              // ... outros casos
            }

            if (msg.properties.replyTo && this.channel) {
              console.log("[SubmissionService] Sending response:", response);
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
              "[SubmissionService] Error processing message:",
              error
            );
            this.channel.ack(msg);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.error("[SubmissionService] Connection error:", error);
      throw error;
    }
  }

  async sendToQueue(queue: string, data: any) {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }
    return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }

  async getChannel() {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }
    return this.channel;
  }
}
