import { useDispatch, useSelector } from 'react-redux';
import { hideToast, selectToast } from '../../store/slices/uiSlice';
import styles from './Toast.module.css';

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

export default function Toast() {
  const dispatch = useDispatch();
  const toast    = useSelector(selectToast);

  if (!toast) return null;

  return (
    <div
      className={`${styles.toast} ${styles[toast.type] || ''}`}
      role="alert"
      onClick={() => dispatch(hideToast())}
    >
      <span className={styles.icon}>{ICONS[toast.type] || ICONS.info}</span>
      <span className={styles.message}>{toast.message}</span>
    </div>
  );
}
