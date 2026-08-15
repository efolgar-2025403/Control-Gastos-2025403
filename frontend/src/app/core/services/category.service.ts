import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/categories';

  getCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }

  createCategory(
    category: CreateCategoryRequest
  ): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.apiUrl, category);
  }

  updateCategory(
    id: number,
    category: CreateCategoryRequest
  ): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(
      `${this.apiUrl}/${id}`,
      category
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}