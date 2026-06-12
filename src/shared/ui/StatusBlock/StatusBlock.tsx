import React from 'react';
import clsx from 'clsx';
import styles from './StatusBlock.module.scss';

type Props = {
  variant: 'loading' | 'error' | 'empty';
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function StatusBlock({ variant, title, description, action }: Props) {
  return (
    <div className={clsx(styles.root, styles[variant])} role={variant === 'error' ? 'alert' : 'status'}>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.desc}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
