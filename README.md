# Tarea #2: Asistente Temático con Ollama

**Curso:** Bases de Datos con IA  
**Estudiante:** Luis Velasquez 24011341

## Descripción del Proyecto

Este servidor backend desarrollado en Node.js con TypeScript implementa un asistente inteligente educativo enfocado en la tutoría de JavaScript. El sistema expone una arquitectura limpia y modular dividida en rutas, controladores y servicios, comunicándose localmente con el motor de Ollama utilizando el modelo gemma3.

## Procedimiento de Configuración e Instalación

1. **Inicialización**: Se configuró la estructura base del proyecto con Express y TypeScript instalando las dependencias necesarias de entorno de producción y desarrollo.
2. **Seguridad**: Las configuraciones locales y puertos se aislaron utilizando variables de entorno (`.env`) para evitar publicar datos sensibles del entorno local, restringiendo su subida mediante el archivo `.gitignore`.
3. **Integración de IA**: Se programó un servicio dedicado (`OllamaService`) estructurado para consumir la API de Ollama de forma síncrona pasando un arreglo de mensajes históricos.
4. **Persistencia**: Se manejó el historial conversacional en memoria volátil dentro del controlador para cumplir con el requerimiento del seguimiento de chat.

## Evidencias de Funcionamiento (Pruebas en Postman)

### 1. Pregunta Técnica

- **Entrada**: Explicación de un closure y un ejemplo sencillo en JavaScript.
- **Evidencia**:
  ![Prueba Tecnica](./tarea_capturas_pantalla/1_peticion_tecnica_Ollama.png)

### 2. Pregunta Creativa

- **Entrada**: Analogía del mundo real para explicar Promesas y async/await.
- **Evidencia**:
  ![Prueba Creativa](./tarea_capturas_pantalla/2_peticion_creativa_Ollama.png)

### 3. Pregunta de Seguimiento (Prueba de memoria)

- **Entrada**: Solicitud de un ejercicio práctico basado en la analogía anterior sin repetir el nombre del concepto.
- **Evidencia**:
  ![Prueba de Seguimiento](./tarea_capturas_pantalla/3_peticion_seguimiento_Ollama.png)
