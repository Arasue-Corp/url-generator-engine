const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS que ya sabemos que funciona
app.use(cors({
  origin: 'https://arasue-corp.github.io'
}));

app.get('/get-bridge-url', async (req, res) => {
  const apiUrl = 'https://www.itcratingservices.com/webservices/itcrateengineapi/api/CarrierBridges/be7833c2-9c83-4596-b03a-bae6e7fa0d13';

  try {
    // Hacemos la llamada a la API, pero le decimos a axios que NO siga las redirecciones.
    await axios.get(apiUrl, {
      maxRedirects: 0 // Esto es clave: previene que axios siga la redirección.
    });
    
    // Si la llamada tiene éxito sin redirigir (lo cual es improbable), envía un mensaje.
    res.status(500).json({ message: 'La API no respondió con una redirección como se esperaba.' });

  } catch (error) {
    // El error esperado es que axios falle porque recibió una redirección (códigos 3xx).
    // Podemos verificar si el error contiene la respuesta y la cabecera 'location'.
    if (error.response && error.response.headers.location) {
      
      // ¡Éxito! Aquí está la URL que queremos.
      const redirectUrl = error.response.headers.location;
      console.log('Redirect URL captured:', redirectUrl);
      
      // Enviamos la URL capturada al frontend en un objeto JSON.
      // Usamos una clave como "bridgeUrl" para que tu frontend la pueda procesar.
      res.json({ bridgeUrl: redirectUrl });

    } else {
      // Si el error es por otra cosa (la API está caída, etc.), lo registramos.
      console.error('An unexpected error occurred:', error.message);
      res.status(500).json({ message: 'Ocurrió un error inesperado al llamar a la API.', details: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
