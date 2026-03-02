import { useMutation, useQuery } from '@tanstack/react-query';
import { noteAdapter } from '../modules/Note/adapter';
import type { NoteDto, NoteProps, NoteRequest } from '../modules/Note/types';
import queryClient from '../config/query-client';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { ActionOptions } from '../types/global';

export const useNotes = () => {
  return useQuery<NoteProps[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await axios.get<AxiosResponse<NoteDto[]>>('/notes');

      return res.data.data.map(noteAdapter);
    },
  });
};

export const fetchNotes = () => {
  queryClient.fetchQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await axios.get<AxiosResponse<NoteDto[]>>('/notes');

      return res.data.data.map(noteAdapter);
    },
  });
};

export const useNote = (id: number) => {
  return useQuery<NoteProps>({
    queryKey: ['note', id],
    queryFn: async () => {
      const res = await axios.get<AxiosResponse<NoteDto>>(`/notes/${id}`);

      return noteAdapter(res.data.data);
    },
  });
};

export const fetchNote = (id: number) => {
  queryClient.fetchQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const res = await axios.get<AxiosResponse<NoteDto>>(`/notes/${id}`);

      return noteAdapter(res.data.data);
    },
  });
};

export const useCreateNote = ({ onSuccess }: ActionOptions) => {
  return useMutation({
    mutationFn: (note: NoteRequest) => axios.post('/notes', note),
    onSuccess,
  });
};

export const useUpdateNote = ({ onSuccess }: ActionOptions) => {
  return useMutation({
    mutationFn: ({ id, ...note }: NoteRequest & { id: string }) =>
      axios.patch(`/notes/${id}`, { ...note }),
    onSuccess,
  });
};

export const useDeleteNote = ({ onSuccess }: ActionOptions) => {
  return useMutation({
    mutationFn: (id: number) => axios.delete(`/notes/${id}`),
    onSuccess,
  });
};
