import { ConsumeMessage } from "amqplib";
import { SubmissionController } from "../controllers/submission.controller";
import { MessageService } from "./message.service";

export class QueueService {
  constructor(
    private messageService: MessageService,
    private submissionController: SubmissionController
  ) {}

  async setupConsumers() {
    const channel = await this.messageService.getChannel();

    channel.consume(
      "submission_requests",
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const { action, data } = JSON.parse(msg.content.toString());
          let response;

          switch (action) {
            case "submission/list": {
              console.log(
                "[QueueService] Recebendo request para listar:",
                data
              );
              const mockReq = this.createMockReqRes(data);
              await this.submissionController.list(mockReq.req, mockReq.res);
              response = mockReq.getResponse();
              break;
            }
            case "submission/create": {
              console.log("[QueueService] Criando submissão:", data);
              const mockReq = this.createMockReqRes(data);
              await this.submissionController.create(mockReq.req, mockReq.res);
              response = mockReq.getResponse();
              break;
            }
            case "submission/update": {
              console.log("[QueueService] Atualizando submissão:", data);
              const mockReq = this.createMockReqRes({
                ...data,
                params: { id: data.id },
              });
              await this.submissionController.updateStatus(
                mockReq.req,
                mockReq.res
              );
              response = mockReq.getResponse();
              break;
            }
          }

          channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(response)),
            {
              correlationId: msg.properties.correlationId,
            }
          );

          channel.ack(msg);
        } catch (error) {
          console.error("[QueueService] Error processing message:", error);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );

    console.log("[QueueService] Consumers setup completed");
  }

  private createMockReqRes(data: any) {
    let responseData: any = null;

    const req = {
      body: data,
      params: data.params || {},
      query: {
        studentId: data.studentId,
        professorId: data.professorId,
      },
    } as any;

    const res = {
      status: () => res,
      json: (data: any) => {
        responseData = data;
        return res;
      },
      send: () => res,
    } as any;

    return { req, res, getResponse: () => responseData };
  }
}
