import { NavLink, Outlet } from 'react-router-dom'

import { useAuthContext } from '../features/auth/AuthContext'
import { Button } from '../ui/Button'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/search', label: '搜索' },
  { to: '/profile', label: '个人页' },
]

export function AppLayout() {
  const { isLoggedIn, login, logout } = useAuthContext()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1220px] items-center gap-2 px-4 py-2.5">
          <strong className="mr-2 text-lg font-extrabold tracking-[0.2px]">Waterfall Lab</strong>
          <nav className="flex flex-1 items-center gap-2" aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? 'rounded-full bg-[#ffe8ec] px-3 py-2 text-sm font-semibold text-[var(--accent)]'
                        : 'rounded-full px-3 py-2 text-sm font-semibold text-[var(--text-muted)]'
                    }
                  >
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <Button
            tone={isLoggedIn ? 'ghost' : 'primary'}
            onClick={isLoggedIn ? logout : login}
            data-testid="auth-toggle"
          >
            {isLoggedIn ? '退出登录' : '登录'}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-[1220px] px-4 pb-12 pt-4">
        <Outlet />
      </main>
    </div>
  )
}
