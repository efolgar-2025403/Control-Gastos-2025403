import {
  CreateExpenseInput,
  Expense,
  UpdateExpenseInput
} from '../models/expense.model.js';

import {
  ExpenseRepository,
  CreateExpenseData,
  UpdateExpenseData
} from '../repositories/expense.repository.js';

const expenseRepository = new ExpenseRepository();

export async function getExpenses(
  userId: number
): Promise<Expense[]> {
  return expenseRepository.findAll(userId);
}

export async function getExpenseById(
  id: string,
  userId: number
): Promise<Expense | null> {
  return expenseRepository.findById(id, userId);
}

export async function createExpense(
  input: CreateExpenseInput,
  userId: number
): Promise<Expense> {
  const data: CreateExpenseData = {
    amount: input.amount,
    description: input.description ?? null,
    date: input.date,
    category_id: input.category_id,
    user_id: userId
  };

  return expenseRepository.create(data);
}

export async function updateExpense(
  id: string,
  input: UpdateExpenseInput,
  userId: number
): Promise<Expense | null> {
  const data: UpdateExpenseData = {
    amount: input.amount,
    description: input.description ?? null,
    date: input.date,
    category_id: input.category_id
  };

  return expenseRepository.update(
    id,
    userId,
    data
  );
}

export async function deleteExpense(
  id: string,
  userId: number
): Promise<boolean> {
  return expenseRepository.delete(id, userId);
}