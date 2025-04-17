import nationalities from "i18n-nationality";

const validAlpha3Codes = Object.keys(nationalities.getAlpha3Codes());

const isValidAlpha3Citizenship = (code) => {
    return validAlpha3Codes.includes(code.toUpperCase());
};

const isValidUUID = (id) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

const isValidStudentNumber = (studentNum) => {
    const match = /^(\d{4})(\d{4,5})$/.exec(studentNum);
    if (!match) return false;

    const batchYear = parseInt(match[1], 10);
    const currentYear = new Date().getFullYear();

    return batchYear >= 1910 && batchYear <= currentYear;
};

export {
    isValidAlpha3Citizenship,
    isValidUUID,
    isValidStudentNumber
};