import { NavLink, Outlet } from 'react-router-dom'

import styles from './AppLayout.module.css'

const navItems = [
  { to: '/', label: 'Feed' },
  { to: '/favorites', label: 'Favorites' },
]

export function AppLayout() {
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
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
