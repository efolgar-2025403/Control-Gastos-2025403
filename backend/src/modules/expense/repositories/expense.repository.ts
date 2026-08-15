import { pool } from '../../../config/database.js';
import { Expense } from '../models/expense.model.js';

export interface CreateExpenseData {
  amount: number;
  description?: string | null;
  date: string;
  category_id: string;
  user_id: number;
}

export interface UpdateExpenseData {
  amount: number;
  description?: string | null;
  date: string;
  category_id: string;
}

export class ExpenseRepository {
  async findAll(userId: number): Promise<Expense[]> {
    const result = await pool.query<Expense>(
      `
      SELECT
        id,
        amount,
        description,
        date,
        category_id,
        created_at,
        updated_at
      FROM expenses
      WHERE user_id = $1
      ORDER BY date DESC, id DESC
      `,
      [userId]
    );

    return result.rows;
  }

  async findById(
    id: string,
    userId: number
  ): Promise<Expense | null> {
    const result = await pool.query<Expense>(
      `
      SELECT
        id,
        amount,
        description,
        date,
        category_id,
        created_at,
        updated_at
      FROM expenses
      WHERE id = $1
        AND user_id = $2
      `,
      [id, userId]
    );

    return result.rows[0] ?? null;
  }

  async create(
    data: CreateExpenseData
  ): Promise<Expense> {
    const result = await pool.query<Expense>(
      `
      INSERT INTO expenses (
        amount,
        description,
        date,
        category_id,
        user_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        amount,
        description,
        date,
        category_id,
        created_at,
        updated_at
      `,
      [
        data.amount,
        data.description ?? null,
        data.date,
        data.category_id,
        data.user_id
      ]
    );

    return result.rows[0];
  }

  async update(
    id: string,
    userId: number,
    data: UpdateExpenseData
  ): Promise<Expense | null> {
    const result = await pool.query<Expense>(
      `
      UPDATE expenses
      SET
        amount = $1,
        description = $2,
        date = $3,
        category_id = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
        AND user_id = $6
      RETURNING
        id,
        amount,
        description,
        date,
        category_id,
        created_at,
        updated_at
      `,
      [
        data.amount,
        data.description ?? null,
        data.date,
        data.category_id,
        id,
        userId
      ]
    );

    return result.rows[0] ?? null;
  }

  async delete(
    id: string,
    userId: number
  ): Promise<boolean> {
    const result = await pool.query(
      `
      DELETE FROM expenses
      WHERE id = $1
        AND user_id = $2
      `,
      [id, userId]
    );

    return result.rowCount === 1;
  }
}