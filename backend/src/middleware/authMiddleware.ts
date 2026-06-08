// Importo los tipos de Express que necesito para el middleware
// NextFunction es el tipo de la función "next" que llama al siguiente paso
import { Request, Response, NextFunction } from "express";

// Un middleware es una función que se ejecuta ENTRE que llega la petición y llega al controlador
// Puede dejar pasar la petición (llamando a next()) o cortarla (respondiendo directamente)
// En este caso lo uso como "guardia" que revisa si el usuario está logueado

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Reviso si hay un userId guardado en la sesión
  // Si el usuario inició sesión correctamente, express-session guarda el userId aquí
  // Si no hay userId, el usuario no está logueado (o nunca lo estuvo)
  if (!req.session.userId) {
    // Corto la petición aquí y devuelvo error 401 (No autorizado)
    // La petición NUNCA llega al controlador si no hay sesión
    return res.status(401).json({ error: "No autorizado. Inicia sesión para continuar." });
  }

  // Si llegué hasta aquí, el usuario tiene sesión activa
  // Llamo a next() para que la petición siga su camino hacia el controlador
  next();
};
