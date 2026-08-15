import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Category,
  CategoryService
} from '../../core/services/category.service';

import {
  Expense,
  ExpenseService
} from '../../core/services/expense.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss'
})
export class Expenses implements OnInit {

  private readonly expenseService = inject(ExpenseService);
  private readonly categoryService = inject(CategoryService);

  expenses: Expense[] = [];
  categories: Category[] = [];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  editingId: string | null = null;

  form = {
    amount: 0,
    description: '',
    date: '',
    category_id: 0
  };

  ngOnInit(): void {
    this.setDefaultDate();
    this.loadCategories();
    this.loadExpenses();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'No se pudieron cargar las categorías.';
      }
    });
  }

  loadExpenses(): void {
    this.loading = true;
    this.errorMessage = '';

    this.expenseService.getExpenses().subscribe({
      next: (response) => {
        this.expenses = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading expenses:', error);

        this.errorMessage =
          'No se pudieron cargar los gastos.';

        this.loading = false;
      }
    });
  }

  saveExpense(): void {
    this.clearMessages();

    if (this.form.amount <= 0) {
      this.errorMessage =
        'El monto debe ser mayor que cero.';
      return;
    }

    if (!this.form.description.trim()) {
      this.errorMessage =
        'La descripción es obligatoria.';
      return;
    }

    if (!this.form.date) {
      this.errorMessage =
        'La fecha es obligatoria.';
      return;
    }

    if (!this.form.category_id) {
      this.errorMessage =
        'Debes seleccionar una categoría.';
      return;
    }

    this.saving = true;

    const request = {
      amount: Number(this.form.amount),
      description: this.form.description.trim(),
      date: this.form.date,
      category_id: Number(this.form.category_id)
    };

    if (this.editingId === null) {

      this.expenseService.createExpense(request).subscribe({
        next: () => {
          this.successMessage =
            'Gasto registrado correctamente.';

          this.resetForm();
          this.loadExpenses();
        },

        error: (error) => {
          console.error('Error creating expense:', error);

          this.errorMessage =
            'No se pudo registrar el gasto.';

          this.saving = false;
        }
      });

    } else {

      this.expenseService
        .updateExpense(this.editingId, request)
        .subscribe({
          next: () => {
            this.successMessage =
              'Gasto actualizado correctamente.';

            this.resetForm();
            this.loadExpenses();
          },

          error: (error) => {
            console.error('Error updating expense:', error);

            this.errorMessage =
              'No se pudo actualizar el gasto.';

            this.saving = false;
          }
        });
    }
  }

  editExpense(expense: Expense): void {
    this.clearMessages();

    this.editingId = expense.id;

    this.form = {
      amount: Number(expense.amount),
      description: expense.description,
      date: expense.date.substring(0, 10),
      category_id: Number(expense.category_id)
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  deleteExpense(expense: Expense): void {
    this.clearMessages();

    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar el gasto "${expense.description}"?`
    );

    if (!confirmed) {
      return;
    }

    this.expenseService.deleteExpense(expense.id).subscribe({
      next: () => {
        this.successMessage =
          'Gasto eliminado correctamente.';

        if (this.editingId === expense.id) {
          this.resetForm();
        }

        this.loadExpenses();
      },

      error: (error) => {
        console.error('Error deleting expense:', error);

        this.errorMessage =
          'No se pudo eliminar el gasto.';
      }
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(
      item => Number(item.id) === Number(categoryId)
    );

    return category?.name ?? 'Sin categoría';
  }

  resetForm(): void {
    this.form = {
      amount: 0,
      description: '',
      date: this.getToday(),
      category_id: 0
    };

    this.editingId = null;
    this.saving = false;
  }

  cancelEdit(): void {
    this.resetForm();
    this.clearMessages();
  }

  setDefaultDate(): void {
    this.form.date = this.getToday();
  }

  getToday(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}