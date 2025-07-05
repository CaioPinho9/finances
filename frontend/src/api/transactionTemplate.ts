import type { TransactionTemplate } from "../types/types";
import apiClient from "./apiClient";

const transactionTemplatesApi = {
  getAll: () => apiClient.get<TransactionTemplate[]>("/transaction-templates"),
  getByTitle: (title: string) =>
    apiClient.get<TransactionTemplate>(`/transaction-templates/${title}`),
  create: (template: Omit<TransactionTemplate, "id" | "amount" | "userId">) =>
    apiClient.post<TransactionTemplate>("/transaction-templates", template),
  update: (title: string, templateDetails: Partial<TransactionTemplate>) =>
    apiClient.put<TransactionTemplate>(
      `/transaction-templates/${title}`,
      templateDetails
    ),
  delete: (title: string) =>
    apiClient.delete<void>(`/transaction-templates/${title}`),
};

export default transactionTemplatesApi;
