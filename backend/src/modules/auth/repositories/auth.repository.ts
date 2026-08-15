import { pool } from '../../../config/database.js';
import { User } from '../models/user.model.js';

export class AuthRepository {

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        created_at,
        updated_at
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email]
    );

    return result.rows[0] ?? null;
  }

  async create(
    name: string,
    email: string,
    passwordHash: string
  ): Promise<User> {

    const result = await pool.query<User>(
      `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        email,
        password_hash,
        created_at,
        updated_at
      `,
      [name, email, passwordHash]
    );

    return result.rows[0];
  }
}