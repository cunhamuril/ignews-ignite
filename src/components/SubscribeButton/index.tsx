import styles from "./styles.module.scss";

const SubscribeButton: React.FC = () => {
  return (
    <button type="button" className={styles.subscribeButton}>
      subscribe now
    </button>
  );
};

export default SubscribeButton;
