import styles from './header.module.scss';
import Link from "next/link";

export function Header() {
  return (
    <header>
      <nav className={styles.container}>
        <Link href="/">
          <a>
            <img src="/images/logo.svg" alt="logo" />
            <img src="/images/spacetraveling.svg" alt="logo" />
          </a>
        </Link>
      </nav>
    </header>
  )
}
