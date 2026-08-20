import { randomInt } from "crypto";

export const generateOTP = () => {
    return randomInt(100000, 1000000).toString();
};

export const generateOTPExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000);
};