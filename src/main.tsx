import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CRDExplorerPage } from './pages/CRDExplorerPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { KueuePage } from './pages/KueuePage';
import './style.css';

const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/crds',
    element: <CRDExplorerPage />,
  },
  {
    path: '/architecture',
    element: <ArchitecturePage />,
  },
  {
    path: '/kueue',
    element: <KueuePage />,
  },
]);

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
