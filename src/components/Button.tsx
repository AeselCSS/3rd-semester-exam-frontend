import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: ReactNode | string;
    variant?: 'primary' | 'secondary' | 'danger' | 'cancel' | 'close';
}

const buttonStyles = {
    primary: 'text-white bg-slate-600 hover:bg-slate-500',
    secondary: 'text-slate-500 bg-slate-300 hover:bg-slate-400',
    danger: 'text-white bg-red-500 hover:bg-red-600',
    cancel: 'text-gray-500 bg-slate-100 hover:bg-gray-50 border border-slate-200',
    close: 'text-gray-500 bg-slate-100 hover:bg-gray-50 border border-slate-200',
};

const Button = ({ label, variant = 'primary', className, ...props }: ButtonProps) => {
    const variantClassName = buttonStyles[variant];
    return (
        <button
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${variantClassName} ${className}`}
            {...props}
        >
            {label}
        </button>
    );
};

export default Button;
