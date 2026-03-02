import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@mantine/core/styles.css';
import {
  createAxiosRequestInterceptor,
  createAxiosResponseInterceptor,
} from './config/interceptor.ts';

createAxiosRequestInterceptor();
createAxiosResponseInterceptor();

createRoot(document.getElementById('root')!).render(<App />);
