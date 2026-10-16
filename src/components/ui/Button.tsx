import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-ui)] font-semibold whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark',
  secondary: 'border border-[#c3ccd0] bg-surface text-primary-dark hover:border-primary hover:bg-[#f2f5f6]',
  ghost: 'text-primary-dark hover:bg-[#ebeff1]',
  danger: 'bg-danger text-white hover:bg-[#862f25]',
  success: 'bg-green text-white hover:bg-[#3a634d]',
  inverse: 'bg-white text-primary-dark hover:bg-sand',
};

const sizes: Record<Size, string> = {
  sm: 'min-h-10 px-3 text-sm',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-6 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export function Button({ variant = 'primary', size = 'md', icon, iconRight, className, children, loading, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={cx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
      {iconRight}
    </button>
  );
}

type LinkButtonProps = CommonProps & { to: string; state?: unknown; 'aria-label'?: string; id?: string };

export function LinkButton({ variant = 'primary', size = 'md', icon, iconRight, className, children, to, state, ...rest }: LinkButtonProps) {
  return (
    <Link to={to} state={state} className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}
