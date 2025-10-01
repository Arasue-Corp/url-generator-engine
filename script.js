// 1. Instalar dependencias: npm install express axios cors
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // ¡Importante!

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  // Imprime en los logs de Render la cabecera 'origin' que llega en cada petición.
  console.log('Request received from origin:', req.headers.origin);
  next();
});

// 2. Configurar CORS en tu proxy
// Esto le dirá al navegador que tu página de GitHub Pages tiene permiso para llamar a este proxy.
app.use(cors({
  origin: 'https://arasue-corp.github.io/URL-generator-insurtech' // ¡Pon aquí la URL de tu GitHub Pages!
}));

// 3. Crear la ruta que llamará a la API real
app.get('/get-bridge-url', async (req, res) => {
  try {
    const apiUrl = 'https://www.itcratingservices.com/webservices/itcrateengineapi/api/CarrierBridges/be7833c2-9c83-4596-b03a-bae6e7fa0d13';
    
    // El proxy llama a la API. No hay CORS aquí.
    const response = await axios.get(apiUrl);
    
    // El proxy envía la respuesta de vuelta a tu frontend.
    res.json(response.data);

  } catch (error) {
    res.status(500).json({ message: 'Error al contactar la API externa', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en el puerto ${PORT}`);
});
