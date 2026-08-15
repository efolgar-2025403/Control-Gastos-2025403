import { Request, Response } from 'express';

import { AuthService } from '../services/auth.service.js';

export class AuthController {

  private readonly service = new AuthService();

  register = async (
    req: Request,
    res: Response
  ) => {

    try {

      const user = await this.service.register(req.body);

      res.status(201).json({
        message: 'Usuario registrado correctamente',
        user
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : 'Error al registrar usuario';

      res.status(400).json({
        message
      });
    }
  };


  login = async (
    req: Request,
    res: Response
  ) => {

    try {

      const result = await this.service.login(req.body);

      res.status(200).json({
        message: 'Inicio de sesión correcto',
        user: result.user,
        token: result.token
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : 'Error al iniciar sesión';

      res.status(401).json({
        message
      });
    }
  };
}