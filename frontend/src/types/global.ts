import type { AxiosResponse } from 'axios';

export type ActionOptions<T = unknown> = {
  onSuccess: (data?: AxiosResponse<T>) => void;
};
