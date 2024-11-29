import fs from "fs/promises";
import path from "path";

export class S3Service {
  private uploadsDir = path.join(__dirname, "..", "..", "uploads");

  constructor() {
    // Criar diretório de uploads se não existir
    fs.mkdir(this.uploadsDir, { recursive: true })
      .then(() =>
        console.log("[S3Service] Diretório de uploads criado:", this.uploadsDir)
      )
      .catch(console.error);
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    mimetype: string
  ): Promise<string> {
    try {
      // Criar o caminho completo do arquivo
      const filePath = path.join(this.uploadsDir, key);

      // Criar diretórios necessários
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      console.log("[S3Service] Salvando arquivo em:", filePath);

      // Salvar o arquivo
      await fs.writeFile(filePath, buffer);

      // Retornar URL
      return `/uploads/${key}`;
    } catch (error) {
      console.error("[S3Service] Erro ao salvar arquivo:", error);
      throw error;
    }
  }
}
