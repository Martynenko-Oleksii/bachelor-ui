import { Facility, StandardDepartment } from "./customer-management";

export interface SecurityUser {
    userId: string;
    customerId: number;
    facilityGroup: FacilityGroup;
    departmentGroup: DepartmentGroup;
}

export interface FacilityGroup {
    id: number;
    name: string;
    description: string;
    customerId: number;
    facilities: Facility[];
}

export interface DepartmentGroup {
    id: number;
    name: string;
    description: string;
    standardDepartments: StandardDepartment[];
}