import { useMutation, useQuery } from '@tanstack/react-query';
import type { ActionOptions } from '../types/global';
import axios from 'axios';
import type { AuthResponse, UserAuthRequest } from '../modules/User/types';

export const useUserInfo = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axios.get('/me');

      return res.data.data;
    },
  });
};

export const useLogin = ({ onSuccess }: ActionOptions<AuthResponse>) => {
  return useMutation({
    mutationFn: (userData: UserAuthRequest) => axios.post('/login', userData),
    onSuccess,
  });
};

export const useRegister = ({ onSuccess }: ActionOptions<AuthResponse>) => {
  return useMutation({
    mutationFn: (userData: UserAuthRequest) =>
      axios.post('/register', userData),
    onSuccess,
  });
};

export const useLogout = ({ onSuccess }: ActionOptions) => {
  return useMutation({
    mutationFn: () => axios.post('/logout'),
    onSuccess,
  });
};
