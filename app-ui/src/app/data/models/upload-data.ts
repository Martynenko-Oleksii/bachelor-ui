export interface FileType {
    id: number;
    name: string;
}

export interface FileMapping {
    id: number;
    name: string;
    description: string;
    mappingJson: string;
    fileType: FileType;
}

export interface Mapping {
    [key: string]: string;
}

export interface ErrorMessage {
    columnValue: string[];
    columnError: string[];
}

export interface CostCenter {
    number: string;
    description: string;
    facilityID: number;
    department: Department | null;
}

export interface Department {
    id: number;
    standardDepartmentId: number;
    name: string;
    shortName: string;
    facilityId: number;
}

export interface StandardDepartment {
    id: number;
    name: string;
    description: string;
}

export interface Account {
    code: string;
    description: string;
    source: AccountSource;
    type: string;
    facilityId: number;
}

export enum AccountSource {
    GL = 'GL',
    PR = 'PR'
}

export const accountTypes: { [key: string]: string[] } = {
    'GL': ['E', 'R', 'V', 'A', 'L', 'I'],
    'PR': ['P', 'N', 'C']
}

export interface ValueType {
    id: number;
    name: string;
}

export interface DepartmentElement {
    id: number;
    standardDepartmentId: number;
    name: string;
}

export interface MappingTableRow {
    mappingId: number;
    costCenter: CostCenter;
    account: Account;
    valueType: ValueType;
    departmentElement: DepartmentElement | null;
}