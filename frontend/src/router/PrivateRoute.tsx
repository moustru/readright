import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import Cookies from 'js-cookie';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const accessToken = Cookies.get('accessToken');

  return accessToken ? children : <Navigate to="/login" replace />;
};
