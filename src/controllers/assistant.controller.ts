import { Request, Response } from 'express';
import { OllamaService, ChatMessage } from '../services/ollama.service';

// Estructura en memoria persistente mientras el servidor este encendido para almacenar el contexto del chat
const conversationHistory: ChatMessage[] = [
  {
    role: 'system',
    content: 'Eres un tutor experto en el lenguaje de programacion JavaScript. Tu objetivo es educar a estudiantes de forma clara, amigable y estructurada. Siempre debes responder en español, utilizar ejemplos de codigo concisos y mantener un tono pedagogico alentador.'
  }
];

export class AssistantController {
  
  /**
   * Procesa la consulta del estudiante, interactua con el modelo de IA y mantiene la memoria de la conversacion.
   */
  public static async queryAssistant(req: Request, res: Response): Promise<void> {
    try {
      const { text } = req.body;

      // Validacion estricta para asegurar la integridad de los datos de entrada
      if (!text || typeof text !== 'string') {
        res.status(400).json({ 
          error: 'Peticion invalida. Se requiere un campo "text" de tipo string en el cuerpo de la solicitud.' 
        });
        return;
      }

      // Registrar la pregunta del estudiante en el historial de conversacion
      conversationHistory.push({ role: 'user', content: text });

      // Consumir el servicio Ollama enviando todo el contexto acumulado
      const assistantResponse = await OllamaService.chat(conversationHistory);

      // Registrar la respuesta generada por la IA para mantener el hilo de seguimiento
      conversationHistory.push({ role: 'assistant', content: assistantResponse });

      // Responder exitosamente al cliente con la respuesta estructurada
      res.status(200).json({ response: assistantResponse });

    } catch (error) {
      console.error('[ASSISTANT CONTROLLER ERROR]:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor al procesar la consulta con el asistente de IA.' 
      });
    }
  }
}