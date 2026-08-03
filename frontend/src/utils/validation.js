export const validateName = (name) =>{
    if (!name.trim()){
        return "Name is required";
    }
    if (name.trim().length <3){
        return "Name must be at least 3 characters";
    }
    if (name.trim().length > 30){
        return "Name cannot exceed 30 characters";
    }
    return "";
};

export const validateEmail = (email) =>{
    if (!email.trim()){
        return "Email is required";
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)){
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
    const regex =
        /^(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (!regex.test(password)) {
        return "Password must contain one special character";
    }
    return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword){
        return "Confirm password is required";
    }
    if (password!==confirmPassword){
        return "Passwords do not match";
    }
    return "";
}