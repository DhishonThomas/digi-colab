

export const validateName = (name: string): string | null => {
    if (!name.trim()) return "Name is required";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/.test(name)) return "Invalid Name (Min 2 letters, no special characters)";
    return null;
};

export const validateGuardian = (guardian: string): string | null => {
    if (!guardian.trim()) return "Guardian Name is required";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/.test(guardian)) return "Invalid Guardian Name";
    return null;
};

export const validateAddress = (address: string): string | null => {
    if (!address.trim()) return "Address is required";
    if (!/^[A-Za-z0-9À-ÖØ-öø-ÿ\s,.'-/]{5,}$/.test(address)) return "Invalid Address (Min 5 characters)";
    return null;
};

export const validateDOB = (dob: string): string | null => {
    if (!dob.trim()) return "Date of Birth is required";
    if (!/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(dob)) return "Invalid Date Format (YYYY-MM-DD)";
    return null;
};

export const validateGender = (gender: string): string | null => {
    if (!gender.trim()) return "Gender is required";
    if (!/^(male|female|other)$/i.test(gender)) return "Invalid Gender (Choose Male, Female, or Other)";
    return null;
};

export const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) return "Phone Number is required";
    if (!/^[6-9]\d{9}$/.test(phone)) return "Invalid Phone Number (Must be 10 digits, start with 6-9)";
    return null;
};
