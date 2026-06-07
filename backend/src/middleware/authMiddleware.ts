import { Request, Response, NextFunction } from "express";

// Verifica que exista una sesión activa antes de permitir el acceso
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "No autorizado. Inicia sesión para continuar." });
  }
  next();
};
