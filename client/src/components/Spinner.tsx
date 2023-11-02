import SpinnerIcon from '../assets/icons/SpinnerIcon';
import styles from './Spinner.module.css';

export default function Spinner() {
  return (
    <div className={styles.spinner}>
      <SpinnerIcon />
    </div>
  );
}
