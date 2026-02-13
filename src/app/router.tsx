import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './AppLayout'
import { DetailPage } from '../pages/DetailPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { FeedPage } from '../pages/FeedPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RouteErrorPage } from '../pages/RouteErrorPage'
import { SearchPage } from '../pages/SearchPage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        { index: true, element: <FeedPage /> },
        { path: 'search', element: <SearchPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'favorites', element: <FavoritesPage /> },
        { path: 'detail/:id', element: <DetailPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
