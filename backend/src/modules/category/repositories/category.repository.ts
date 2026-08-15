import { pool } from '../../../config/database.js';
import { Category } from '../models/category.model.js';

export interface CreateCategoryData {
  name: string;
  description?: string | null;
  user_id: number;
}

export interface UpdateCategoryData {
  name: string;
  description?: string | null;
}

export class CategoryRepository {

  async findAll(userId: number): Promise<Category[]> {
    const result = await pool.query<Category>(
      `
      SELECT
        id,
        name,
        description,
        created_at,
        updated_at
      FROM categories
      WHERE user_id = $1
      ORDER BY id ASC
      `,
      [userId]
    );

    return result.rows;
  }

  async findById(
    id: number,
    userId: number
  ): Promise<Category | null> {

    const result = await pool.query<Category>(
      `
      SELECT
        id,
        name,
        description,
        created_at,
        updated_at
      FROM categories
      WHERE id = $1
        AND user_id = $2
      `,
      [id, userId]
    );

    return result.rows[0] ?? null;
  }

  async create(
    data: CreateCategoryData
  ): Promise<Category> {

    const result = await pool.query<Category>(
      `
      INSERT INTO categories (
        name,
        description,
        user_id
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        description,
        created_at,
        updated_at
      `,
      [
        data.name,
        data.description ?? null,
        data.user_id
      ]
    );

    return result.rows[0];
  }

  async update(
    id: number,
    userId: number,
    data: UpdateCategoryData
  ): Promise<Category | null> {

    const result = await pool.query<Category>(
      `
      UPDATE categories
      SET
        name = $1,
        description = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
        AND user_id = $4
      RETURNING
        id,
        name,
        description,
        created_at,
        updated_at
      `,
      [
        data.name,
        data.description ?? null,
        id,
        userId
      ]
    );

    return result.rows[0] ?? null;
  }

  async delete(
    id: number,
    userId: number
  ): Promise<boolean> {

    const result = await pool.query(
      `
      DELETE FROM categories
      WHERE id = $1
        AND user_id = $2
      `,
      [id, userId]
    );

    return result.rowCount === 1;
  }
}