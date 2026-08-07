export const validateName = (name) => {
    // 1. Check if empty or only contains spaces
    if (!name || !name.trim()) {
        return "Name is required";
    }

    // 2. Check minimum length after trimming leading/trailing spaces
    if (name.trim().length < 3) {
        return "Name must be at least 3 characters";
    }

    // 3. Optional: Ensure name contains valid letters/spaces only (no pure numbers/symbols)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        return "Name can only contain letters and spaces";
    }

    // 4. Check max length
    if (name.trim().length > 30) {
        return "Name cannot exceed 30 characters";
    }

    return "";
};

export const validateEmail = (email) => {
    // 1. Check if empty or only contains spaces
    if (!email || !email.trim()) {
        return "Email is required";
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return "Invalid email address";
    }
    return "";
};

export const validatePassword = (password) => {
    if (!password) {
        return "Password is required";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Password must contain at least one special character";
    }
    return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return "Confirm password is required";
    }
    if (password !== confirmPassword) {
        return "Passwords do not match";
    }
    return "";
};