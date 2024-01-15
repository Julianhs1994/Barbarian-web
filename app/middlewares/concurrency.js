// Middleware para limitar la concurrencia
const inProgress = [];

const limitConcurrency = async (req, res, next) => {
    if (inProgress.length >= 5) { // Límite de 5 solicitudes concurrentes
      return res.status(503).send('Servicio no disponible, por favor intenta más tarde');
    }

    inProgress.push(true); // Marcar la solicitud actual como en progreso
    await next(); // Continuar con la siguiente middleware o manejador de ruta
    inProgress.pop(); // Marcar la solicitud como completada
};    

export const methods = {
    limitConcurrency
} 