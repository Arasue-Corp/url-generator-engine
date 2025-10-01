// 1. Importar los paquetes necesarios
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// 2. Inicializar la aplicación de Express
const app = express();
const PORT = process.env.PORT || 3000; // Render usa la variable de entorno PORT

// --- Bloque de Depuración ---
// Este middleware se ejecuta para CADA petición que llega al servidor.
// Su única función es imprimir en la consola (los logs de Render) la cabecera 'origin'.
app.use((req, res, next) => {
  console.log('--> Request received from origin:', req.headers.origin);
  next(); // Llama a la siguiente función en la cadena (en este caso, cors)
});
// ----------------------------

// 3. Configurar CORS
// Mantenemos tu configuración original. El log de arriba nos dirá si es correcta o no.
app.use(cors({
  origin: 'https://arasue-corp.github.io'
}));

// 4. Definir la ruta principal del proxy
app.get('/get-bridge-url', async (req, res) => {
  try {
    // La URL de la API externa a la que queremos llamar
    const apiUrl = 'https://www.itcratingservices.com/webservices/itcrateengineapi/api/CarrierBridges/be7833c2-9c83-4596-b03a-bae6e7fa0d13';
    
    console.log('Calling external API...');
    const response = await axios.get(apiUrl);
    console.log('API call successful.');
    
    // Devolvemos los datos de la API externa a nuestro frontend
    res.json(response.data);

  } catch (error) {
    console.error('Error calling external API:', error.message);
    // Si hay un error, lo enviamos al frontend para que sepa qué pasó
    res.status(500).json({ message: 'Error al contactar la API externa', details: error.message });
  }
});

// 5. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
