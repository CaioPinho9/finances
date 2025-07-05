import type { Transaction, CsvType } from "../types/types";
import apiClient from "./apiClient";

const transactionsApi = {
  getByMonth: (year: number, month: number) =>
    apiClient.get<Transaction[]>(`/transactions/by-month/${year}/${month}`),

  uploadCsv: (file: File, userId: number, csvType: CsvType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId.toString());
    formData.append("csvType", csvType);

    return apiClient.post("/transactions/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  update: (id: string, transactionDetails: Partial<Transaction>) =>
    apiClient.put<Transaction>(`/transactions/${id}`, transactionDetails),

  updateCategory: (
    id: string,
    categoryId: number | null,
  ) =>
    apiClient.put<Transaction>(`/transactions/${id}/${categoryId}`),

  create: (transaction: Omit<Transaction, "id">) =>
    apiClient.post<Transaction>("/transactions", transaction),

  delete: (id: string) => apiClient.delete<void>(`/transactions/${id}`),
};

export default transactionsApi;
