import { createBrowserRouter } from 'react-router';
import { NotePage } from '../pages/NotePage';
import { Notes } from '../pages/Notes';
import { NewNote } from '../pages/NewNote';
import { LoginPage } from '../pages/LoginPage';
import { PrivateRoute } from './PrivateRoute';

export const router = createBrowserRouter([
  {
    index: true,
    element: (
      <PrivateRoute>
        <Notes />
      </PrivateRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/notes',
    element: (
      <PrivateRoute>
        <Notes />
      </PrivateRoute>
    ),
    children: [
      {
        path: ':id',
        element: (
          <PrivateRoute>
            <NotePage />
          </PrivateRoute>
        ),
      },
      {
        path: 'new',
        element: (
          <PrivateRoute>
            <NewNote />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
