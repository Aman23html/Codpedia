export const COMPANY_CONFIG = {
  COMPANY_CODE: "CPS",
  COMPANY_NAME: "Codepedia Solutions",

  EMPLOYEE_CODE_PREFIX: "EMP",
  DEPARTMENT_CODE_PREFIX: "DEPT",

  EMPLOYEE_NUMBER_LENGTH: 3,
} as const;

export const DEPARTMENT_CONFIG = {
  MARKETING: {
    name: "Marketing",
    type: "MARKETING",
    shortCode: "MKT",
  },

  OPERATIONS: {
    name: "Operations",
    type: "OPERATIONS",
    shortCode: "OPS",
  },

  TUTOR: {
    name: "Tutor",
    type: "TUTOR",
    shortCode: "TUT",
  },

  ACCOUNTS: {
    name: "Accounts",
    type: "ACCOUNTS",
    shortCode: "ACC",
  },

  DIGITAL_MARKETING: {
    name: "Digital Marketing",
    type: "DIGITAL_MARKETING",
    shortCode: "DMK",
  },
} as const;