import Spinner from '../../components/Spinner';
import styles from './RecipeSummaryCardSkeleton.module.css';

export default function RecipeSummaryCardSkeleton() {
  return (
    <article className={styles.wrapper}>
      <Spinner />
      <p>Recipes are loading...</p>
    </article>
  );
}
