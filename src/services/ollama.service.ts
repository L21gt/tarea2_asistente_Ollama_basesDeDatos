import dotenv from 'dotenv';

dotenv.config();

// Definición de la interfaz para tipar la estructura de los mensajes del chat
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OllamaService {
  // Obtener la URL base desde las variables de entorno para evitar 'hardcoding' de rutas de red
  private static baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  /**
   * Envía un historial de mensajes al modelo local de Ollama para obtener una respuesta contextual.
   * @param messages Listado de mensajes que representan la conversación actual, incluyendo el contexto del sistema.
   * @returns La cadena de texto generada por el modelo de IA.
   */
  public static async chat(messages: ChatMessage[]): Promise<string> {
    try {
      // Petición HTTP nativa al endpoint del motor de Ollama local
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma3', // Modelo local especificado en el requerimiento del proyecto
          messages: messages,
          stream: false // Desactivamos el streaming para recibir la respuesta completa en un solo bloque JSON
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la comunicacion con Ollama. Status: ${response.status}`);
      }

      // Procesamiento de la respuesta JSON estructurada de Ollama
      const data = await response.json() as { message: { content: string } };
      return data.message.content;

    } catch (error) {
      // Captura y propagación del error hacia las capas superiores (controladores) para su gestión HTTP
      console.error('[OLLAMA SERVICE ERROR]:', error);
      throw error;
    }
  }
}