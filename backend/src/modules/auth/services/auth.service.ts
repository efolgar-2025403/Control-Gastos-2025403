import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  LoginUserDTO,
  RegisterUserDTO
} from '../models/user.model.js';

import { AuthRepository } from '../repositories/auth.repository.js';

export class AuthService {

  private readonly repository = new AuthRepository();

  async register(data: RegisterUserDTO) {

    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();

    if (!name || !email || !data.password) {
      throw new Error('Todos los campos son obligatorios');
    }

    if (data.password.length < 6) {
      throw new Error(
        'La contraseña debe tener al menos 6 caracteres'
      );
    }

    const existingUser =
      await this.repository.findByEmail(email);

    if (existingUser) {
      throw new Error(
        'Ya existe un usuario con ese correo'
      );
    }

    const passwordHash =
      await bcrypt.hash(data.password, 10);

    const user = await this.repository.create(
      name,
      email,
      passwordHash
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }

  async login(data: LoginUserDTO) {

    const email = data.email.trim().toLowerCase();

    if (!email || !data.password) {
      throw new Error(
        'Correo y contraseña son obligatorios'
      );
    }

    const user =
      await this.repository.findByEmail(email);

    if (!user) {
      throw new Error(
        'Correo o contraseña incorrectos'
      );
    }

    const validPassword =
      await bcrypt.compare(
        data.password,
        user.password_hash
      );

    if (!validPassword) {
      throw new Error(
        'Correo o contraseña incorrectos'
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error(
        'JWT_SECRET no está configurado'
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      jwtSecret,
      {
        expiresIn: '2h'
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  }
}