// src/components/App/App.tsx

import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox.tsx";
import Pagination from "../Pagination/Pagination.tsx";
import NoteList from "../NoteList/NoteList.tsx";
import Modal from "../Modal/Modal.tsx";
import NoteForm from "../NoteForm/NoteForm.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import { deleteNote, fetchNotes } from "../../services/noteService.ts";

const PER_PAGE = 12;

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      // Якщо видалили останню нотатку на сторінці — переходимо на попередню
      if (notes.length === 1 && page > 1) {
        setPage(page - 1);
      }
      // Оновлюємо збережену колекцію нотатків
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted.");
    },
    onError: () => {
      toast.error("Failed to delete the note. Please try again.");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Відкладений пошук: запит виконується після паузи у введенні
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 300);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && notes.length === 0 && (
        <ErrorMessage message="No notes found." />
      )}
      {notes.length > 0 && (
        <NoteList
          notes={notes}
          onDelete={handleDelete}
          deletingId={
            deleteMutation.isPending ? deleteMutation.variables : null
          }
        />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
}
