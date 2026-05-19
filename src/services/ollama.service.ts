import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OllamaService {
  /**
   * Consume la API de Ollama utilizando el modulo nativo 'http' con IPv4 estricto.
   * Esto garantiza la comunicacion local en entornos Windows donde el protocolo IPv6 
   * causa bloqueos de red silenciosos.
   */
  public static chat(messages: ChatMessage[]): Promise<string> {
    return new Promise((resolve, reject) => {
      // Concatenacion del contexto de chat en texto plano
      const promptText = messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n') + '\nASSISTANT:';

      const postData = JSON.stringify({
        model: 'gemma3',
        prompt: promptText,
        stream: false
      });

      // Configuracion del socket blindada contra bloqueos de IPv6
      const options = {
        hostname: '127.0.0.1',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        family: 4, // <--- LA REGLA DE ORO QUE DESTRABÓ LA RED
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Connection': 'close'
        },
        timeout: 60000 // 60 segundos de tolerancia para el modelo
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              // Parseo seguro garantizando el tipado para TypeScript
              const parsed = JSON.parse(data) as { response: string };
              resolve(parsed.response);
            } catch (e) {
              reject(new Error('Error al decodificar la respuesta JSON de Ollama.'));
            }
          } else {
            reject(new Error(`Ollama respondio con error HTTP: ${res.statusCode}`));
          }
        });
      });

      req.on('error', (e) => {
        reject(new Error(`Error de conexion: ${e.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout: Ollama no respondio en el tiempo establecido.'));
      });

      req.write(postData);
      req.end();
    });
  }
}