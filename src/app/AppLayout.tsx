import { NavLink, Outlet } from 'react-router-dom'

import styles from './AppLayout.module.css'
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
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={`${styles.inner} ${styles.headerRow}`}>
          <strong className={styles.brand}>Waterfall Lab</strong>
          <nav className={styles.nav} aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                {({ isActive }) => <span data-active={isActive}>{item.label}</span>}
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
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
