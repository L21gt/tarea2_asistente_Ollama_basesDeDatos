import dotenv from 'dotenv';

dotenv.config();

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OllamaService {
  private static baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';

  /**
   * Envía un historial de mensajes al modelo local de Ollama utilizando fetch nativo
   * protegido por un mecanismo de AbortController para evitar congelamientos de red.
   */
  public static async chat(messages: ChatMessage[]): Promise<string> {
    // 1. Instanciar el controlador de aborto nativo
    const controller = new AbortController();
    
    // 2. Configurar un temporizador de seguridad (ej. 15 segundos) 
    // Si la petición excede este tiempo, se dispara el método .abort()
    const timeoutId = setTimeout(() => {
      console.warn('[TIMEOUT]: La peticion a Ollama excedio el tiempo limite. Abortando...');
      controller.abort();
    }, 120000);

    try {
      // 3. Pasar la señal de aborto dentro de las opciones de configuracion del fetch
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma3',
          messages: messages,
          stream: false
        }),
        signal: controller.signal // <--- Vinculación crucial de la señal
      });

      if (!response.ok) {
        throw new Error(`Error en Ollama. Status: ${response.status}`);
      }

      const data = await response.json() as { message: { content: string } };
      return data.message.content;

    } catch (error: any) {
      // 4. Capturar especificamente si el error fue provocado por el AbortController
      if (error.name === 'AbortError') {
        throw new Error('La solicitud fue cancelada automaticamente porque el servidor local de Ollama tardo demasiado en responder.');
      }
      
      console.error('[OLLAMA SERVICE ERROR]:', error);
      throw error;
    } finally {
      // 5. REGLA DE ORO: Limpiar siempre el temporizador para evitar fugas de memoria en Node.js
      clearTimeout(timeoutId);
    }
  }
}