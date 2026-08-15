import { Response } from 'express';

import {
  AuthenticatedRequest
} from '../../auth/middlewares/auth.middleware.js';

import { CategoryService } from '../services/category.service.js';

export class CategoryController {

  private readonly categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAll = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {

    try {

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      const categories =
        await this.categoryService.getAllCategories(
          req.user.id
        );

      res.status(200).json({
        success: true,
        data: categories
      });

    } catch (error) {

      console.error(
        'Error fetching categories:',
        error
      );

      res.status(500).json({
        success: false,
        message: 'Unable to retrieve categories'
      });
    }
  };


  getById = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {

    try {

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
        return;
      }

      const category =
        await this.categoryService.getCategoryById(
          id,
          req.user.id
        );

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category
      });

    } catch (error) {

      console.error(
        'Error fetching category:',
        error
      );

      res.status(500).json({
        success: false,
        message: 'Unable to retrieve category'
      });
    }
  };


  create = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {

    try {

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      const { name, description } = req.body;

      if (
        typeof name !== 'string' ||
        name.trim().length === 0
      ) {
        res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
        return;
      }

      if (name.trim().length > 100) {
        res.status(400).json({
          success: false,
          message:
            'Category name cannot exceed 100 characters'
        });
        return;
      }

      if (
        description !== undefined &&
        description !== null &&
        typeof description !== 'string'
      ) {
        res.status(400).json({
          success: false,
          message: 'Description must be a string'
        });
        return;
      }

      if (
        typeof description === 'string' &&
        description.length > 255
      ) {
        res.status(400).json({
          success: false,
          message:
            'Description cannot exceed 255 characters'
        });
        return;
      }

      const category =
        await this.categoryService.createCategory({
          name: name.trim(),
          description:
            typeof description === 'string'
              ? description.trim() || null
              : null,
          user_id: req.user.id
        });

      res.status(201).json({
        success: true,
        data: category
      });

    } catch (error: any) {

      console.error(
        'Error creating category:',
        error
      );

      if (error?.code === '23505') {
        res.status(409).json({
          success: false,
          message:
            'Ya tienes una categoría con ese nombre'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Unable to create category'
      });
    }
  };


  update = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {

    try {

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
        return;
      }

      const { name, description } = req.body;

      if (
        typeof name !== 'string' ||
        name.trim().length === 0
      ) {
        res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
        return;
      }

      if (name.trim().length > 100) {
        res.status(400).json({
          success: false,
          message:
            'Category name cannot exceed 100 characters'
        });
        return;
      }

      if (
        description !== undefined &&
        description !== null &&
        typeof description !== 'string'
      ) {
        res.status(400).json({
          success: false,
          message: 'Description must be a string'
        });
        return;
      }

      if (
        typeof description === 'string' &&
        description.length > 255
      ) {
        res.status(400).json({
          success: false,
          message:
            'Description cannot exceed 255 characters'
        });
        return;
      }

      const category =
        await this.categoryService.updateCategory(
          id,
          req.user.id,
          {
            name: name.trim(),
            description:
              typeof description === 'string'
                ? description.trim() || null
                : null
          }
        );

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category
      });

    } catch (error: any) {

      console.error(
        'Error updating category:',
        error
      );

      if (error?.code === '23505') {
        res.status(409).json({
          success: false,
          message:
            'Ya tienes una categoría con ese nombre'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Unable to update category'
      });
    }
  };


  delete = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {

    try {

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
        return;
      }

      const deleted =
        await this.categoryService.deleteCategory(
          id,
          req.user.id
        );

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      res.status(204).send();

    } catch (error) {

      console.error(
        'Error deleting category:',
        error
      );

      res.status(500).json({
        success: false,
        message: 'Unable to delete category'
      });
    }
  };
}