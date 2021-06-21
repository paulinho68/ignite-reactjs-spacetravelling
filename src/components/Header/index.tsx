import styles from './header.module.scss';

export function Header() {
  return (
    <header>
      <nav className={styles.container}>
        <img src="/images/logo.svg" alt="logo" />
        <img src="/images/spacetraveling.svg" alt="logo" />
      </nav>
    </header>
  )
}
