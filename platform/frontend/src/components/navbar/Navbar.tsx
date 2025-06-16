import styles from './Navbar.module.css';

const SquareLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#3498db"/>
    <rect x="8" y="8" width="24" height="24" fill="#f8f9fa"/>
  </svg>
);

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.logoContainer}>
        <SquareLogo />
      </div>
      
      <div className={styles.navContent}>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>Home</li>
            <li className={styles.navItem}>About</li>
            <li className={styles.navItem}>Help</li>
          </ul>
        </nav>
        
        <div className={styles.SignInUpSection}>
          <p className={styles.signinText}>Sign in</p>
          <p className={styles.signinText}>Sign Up</p>
        </div>
      </div>
    </div>
  );
};
export default Navbar;