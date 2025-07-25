export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

export const validateNodeForm = (data: { name: string; location: string }): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) errors.name = 'Name is required';
    if (!data.location.trim()) errors.location = 'Location is required';

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 8;
};

export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};