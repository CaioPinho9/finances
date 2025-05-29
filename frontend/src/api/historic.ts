const API_BASE_URL = "http://localhost:8000/api/historic";

export interface HistoricEntry {
  uuid: string;
  date: string;
  user: number;
  amount: number;
  description_bank: string;
  description_custom: string;
}

export enum HistoricColumns {
  uuid = "uuid",
  date = "date",
  amount = "amount",
  description_bank = "description_bank",
  description_custom = "description_custom",
}

export async function createHistoric(file: FormData): Promise<any> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    body: file,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload: ${errorText}`);
  }
  return response.json();
}

export async function getHistoricByDate(
  date: string
): Promise<HistoricEntry[]> {
  const response = await fetch(`${API_BASE_URL}/date/${date}`);
  if (!response.ok) throw new Error("Failed to fetch historic by date");

  const data = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data;
}

export async function updateHistoric(
  data: Partial<HistoricEntry>
): Promise<HistoricEntry> {
  const response = await fetch(`${API_BASE_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update historic entry: ${errorText}`);
  }
  return response.json();
}
