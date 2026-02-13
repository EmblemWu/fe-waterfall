import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'

import { AppLayout } from './AppLayout'
import { DetailPage } from '../pages/DetailPage'
import { FavoritesPage } from '../pages/FavoritesPage'
import { FeedPage } from '../pages/FeedPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { SearchPage } from '../pages/SearchPage'

interface ModalLocationState {
  backgroundLocation?: Location
  returnFocusId?: string
}

function AppRouteTree() {
  const location = useLocation()
  const state = location.state as ModalLocationState | null
  const backgroundLocation = state?.backgroundLocation

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<FeedPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="explore/:noteId" element={<DetailPage mode="page" />} />
          <Route path="detail/:id" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {backgroundLocation ? (
        <Routes>
          <Route path="/explore/:noteId" element={<DetailPage mode="modal" />} />
        </Routes>
      ) : null}
    </>
  )
}

export function AppRoutes() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRouteTree />
    </BrowserRouter>
  )
}
