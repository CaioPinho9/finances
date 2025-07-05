import type { Category } from "../types/types";
import apiClient from "./apiClient";

const categoriesApi = {
  getAll: () => apiClient.get<Category[]>("/categories"),
  getById: (id: number) => apiClient.get<Category>(`/categories/${id}`),
  create: (category: Omit<Category, "id">) =>
    apiClient.post<Category>("/categories", category),
  update: (id: number, categoryDetails: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}`, categoryDetails),
  delete: (id: number) => apiClient.delete<void>(`/categories/${id}`),
};

export default categoriesApi;
