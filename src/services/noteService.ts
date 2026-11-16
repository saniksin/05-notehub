// src/services/noteService.ts

import axios from "axios";
import type { NewNote, Note } from "../types/note.ts";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const BASE_URL = "https://notehub-public.goit.study/api";

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
};

// Отримання сторінки колекції нотатків з пошуком за ключовим словом
export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    params: {
      page,
      perPage,
      // Порожній рядок не передаємо, щоб отримати всю колекцію
      search: search || undefined,
    },
    headers,
  });
  return response.data;
};

// Створення нової нотатки
export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, newNote, {
    headers,
  });
  return response.data;
};

// Видалення нотатки за ідентифікатором
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });
  return response.data;
};
