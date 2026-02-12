import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './AppLayout'
import { DetailPage } from '../pages/DetailPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { FeedPage } from '../pages/FeedPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'detail/:id', element: <DetailPage /> },
    ],
  },
])
