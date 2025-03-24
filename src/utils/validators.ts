

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


export const validateCurrentAddress = (currentAddress: string): string | null => {
    if (!currentAddress.trim()) return "Current address is required";
    if (!/^[A-Za-z0-9À-ÖØ-öø-ÿ\s,.'-/]{5,}$/.test(currentAddress)) 
        return "Invalid Address (Min 5 characters, only letters, numbers, spaces, and ,.'-/ allowed)";
    return null;
};


export const validateBankAccNumber = (bankAccNumber: string): string | null => {
    if (!bankAccNumber.trim()) return "Bank account number is required";
    if (!/^\d{9,18}$/.test(bankAccNumber)) 
        return "Invalid Bank Account Number (Must be 9-18 digits)";
    return null;
};


export const validateBankName = (bankName: string): string | null => {
    if (!bankName.trim()) return "Bank name is required";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s&]{3,50}$/.test(bankName)) 
        return "Invalid Bank Name (Min 3 characters, only letters, spaces, & allowed)";
    return null;
};



export const validateIFSC = (ifsc: string): string | null => {
    if (!ifsc.trim()) return "IFSC code is required";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) 
        return "Invalid IFSC Code (Format: 4 letters, 0, 6 alphanumeric)";
    return null;
};


export const validatePwdCategory = (pwdCategory: string): string | null => {
    if (!pwdCategory.trim()) return "PWD category selection is required";
    if (!/^(Yes|No)$/i.test(pwdCategory)) 
        return "Invalid PWD Category (Must be 'Yes' or 'No')";
    return null;
};


export const validateEntrepreneurshipInterest = (interest: string): string | null => {
    if (!interest.trim()) return "Entrepreneurship interest selection is required";
    if (!/^(Yes|No)$/i.test(interest)) 
        return "Invalid Entrepreneurship Interest (Must be 'Yes' or 'No')";
    return null;
};
