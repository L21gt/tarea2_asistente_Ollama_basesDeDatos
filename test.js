const http = require("http");

console.log("Iniciando prueba de conexion cruda a Ollama...");

const postData = JSON.stringify({
  model: "gemma3",
  prompt: 'Hola, responde con la palabra "Exito" si recibes esto.',
  stream: false,
});

const options = {
  hostname: "127.0.0.1",
  port: 11434,
  path: "/api/generate",
  method: "POST",
  family: 4, // Obliga a Node a usar IPv4 estricto, ignorando configuraciones de red extrañas
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
    Connection: "close", // Evita que el socket se quede en estado "keep-alive"
  },
};

const req = http.request(options, (res) => {
  console.log(`\nEstado de respuesta HTTP: ${res.statusCode}`);
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(`\nRespuesta de Ollama:\n${data}`);
  });
});

req.on("error", (e) => {
  console.error(`\nError fatal de conexion: ${e.message}`);
});

req.write(postData);
req.end();
