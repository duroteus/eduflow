import amqp from "amqplib";

export class MessageService {
  private connection?: amqp.Connection;
  private channel?: amqp.Channel;

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL!);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue("submission_requests", { durable: true });
      await this.channel.assertQueue("user_requests", { durable: true });
      await this.channel.assertQueue("notification_requests", {
        durable: true,
      });

      console.log("[MessageService] Connected to RabbitMQ");
    } catch (error) {
      console.error("[MessageService] Connection error:", error);
      throw error;
    }
  }

  async sendRequest(queue: string, data: any): Promise<any> {
    if (!this.channel) {
      console.log("[MessageService] Trying to reconnect...");
      await this.connect();
    }

    if (!this.channel) {
      throw new Error("Channel not initialized");
    }

    console.log(`[MessageService] Sending to queue ${queue}:`, data);

    const correlationId = Math.random().toString() + Date.now();
    const { queue: replyQueue } = await this.channel.assertQueue("", {
      exclusive: true,
      autoDelete: true,
    });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.channel!.deleteQueue(replyQueue).catch(console.error);
        reject(new Error("Request timeout"));
      }, 60000);

      this.channel!.consume(
        replyQueue,
        (msg: amqp.ConsumeMessage | null) => {
          if (!msg) return;
          if (msg.properties.correlationId === correlationId) {
            clearTimeout(timeout);
            const response = JSON.parse(msg.content.toString());
            this.channel!.ack(msg);
            this.channel!.deleteQueue(replyQueue).catch(console.error);
            resolve(response);
          }
        },
        { noAck: false }
      );

      this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
        correlationId,
        replyTo: replyQueue,
      });
    });
  }
}
