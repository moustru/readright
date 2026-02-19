import { createBrowserRouter } from 'react-router';
import { NotePage } from '../pages/NotePage';
import { Notes } from '../pages/Notes';
import { NewNote } from '../pages/NewNote';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Notes />,
  },
  {
    path: '/notes',
    children: [
      {
        path: ':id',
        element: <NotePage />,
      },
      {
        path: 'new',
        element: <NewNote />,
      },
    ],
  },
]);
