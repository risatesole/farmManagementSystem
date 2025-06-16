import styles from './Navbar.module.css';
import logo from "../../assets/logo.svg"; 

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
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