import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OllamaService {
  public static chat(messages: ChatMessage[]): Promise<string> {
    return new Promise((resolve, reject) => {
      
      // Ya no concatenamos textos crudos. Le pasamos el arreglo limpio a Ollama
      // para que su motor traduzca los roles a los tokens especiales de Gemma 3.
      const postData = JSON.stringify({
        model: 'phi3:mini',
        messages: messages, 
        stream: false
      });

      // Imprimimos el payload exacto para confirmar que no va vacio
      console.log(`\n[TRAZA]: Enviando payload a Ollama por /api/chat:`, postData);

      const options = {
        hostname: '127.0.0.1',
        port: 11434,
        path: '/api/chat', 
        method: 'POST',
        family: 4, 
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Connection': 'close' // <--- Obliga a cerrar el socket una vez que Ollama responde
        },
        timeout: 300000 // <--- AUMENTADO A 5 MINUTOS (300,000 ms)
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              // El endpoint /chat devuelve la respuesta dentro de message.content
              const parsed = JSON.parse(data) as { message: { content: string } };
              resolve(parsed.message.content);
            } catch (e) {
              reject(new Error('Error al decodificar el JSON devuelto por Ollama.'));
            }
          } else {
            reject(new Error(`Ollama respondio con error HTTP: ${res.statusCode}`));
          }
        });
      });

      req.on('error', (e) => reject(new Error(`Error de conexion local: ${e.message}`)));
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout: El modelo gemma3 tardo demasiado en responder.'));
      });

      req.write(postData);
      req.end();
    });
  }
}