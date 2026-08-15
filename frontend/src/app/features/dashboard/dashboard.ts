import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import {
  Category,
  CategoryService
} from '../../core/services/category.service';

import {
  Expense,
  ExpenseService
} from '../../core/services/expense.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  private readonly expenseService = inject(ExpenseService);
  private readonly categoryService = inject(CategoryService);

  expenses: Expense[] = [];
  categories: Category[] = [];

  loading = true;
  errorMessage = '';

  totalExpenses = 0;
  totalAmount = 0;
  averageExpense = 0;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.expenseService.getExpenses().subscribe({
      next: (response) => {
        this.expenses = response.data ?? [];

        this.calculateTotals();

        this.loading = false;
      },

      error: (error) => {
        console.error('Error loading expenses:', error);

        this.errorMessage =
          'No se pudieron cargar los gastos.';

        this.expenses = [];
        this.calculateTotals();

        this.loading = false;
      }
    });

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data ?? [];
      },

      error: (error) => {
        console.error('Error loading categories:', error);

        this.categories = [];
      }
    });
  }

  calculateTotals(): void {
    this.totalExpenses = this.expenses.length;

    this.totalAmount = this.expenses.reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );

    this.averageExpense =
      this.totalExpenses > 0
        ? this.totalAmount / this.totalExpenses
        : 0;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(
      category =>
        Number(category.id) === Number(categoryId)
    );

    return category?.name ?? 'Sin categoría';
  }

  getCategoryTotal(categoryId: number): number {
    return this.expenses
      .filter(
        expense =>
          Number(expense.category_id) ===
          Number(categoryId)
      )
      .reduce(
        (total, expense) =>
          total + Number(expense.amount),
        0
      );
  }

  getCategoryPercentage(categoryId: number): number {
    if (this.totalAmount === 0) {
      return 0;
    }

    return (
      (this.getCategoryTotal(categoryId) /
        this.totalAmount) *
      100
    );
  }

  getRecentExpenses(): Expense[] {
    return [...this.expenses]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, 5);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  }

  refresh(): void {
    this.loadDashboard();
  }
}