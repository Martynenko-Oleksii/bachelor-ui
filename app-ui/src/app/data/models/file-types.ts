export const fileTypeColumns: { [key: string]: string[] } = {
    'Cost Center List': [
        'Cost Center Number',
        'Cost Center Description'
    ],
    'General Ledger Accounts List': [
        'Account Code',
        'Account Description',
        'Account Type'
    ],
    'Payroll Accounts List': [
        'Account Code',
        'Account Description',
        'Account Type'
    ],
    'General Ledger Data': [
        'Cost Center Number',
        'Account Code',
        'Account Description',
        'Value'
    ],
    'Payroll Data': [
        'Cost Center Number',
        'Account Code',
        'Account Description',
        'Hours Worked',
        'Overtime Hours',
        'Hours Paid',
        'Labor Expense',
        'Overtime Expense',
    ],
};