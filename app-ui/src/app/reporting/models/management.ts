export interface Template {
    templateId: number;
    name: string;
    lastModification: Date;
    statusId: number;
    reportTypeId: number;
}

export interface Report {
    reportId: number;
    name: string;
    lastModification: Date;
    statusId: number;
    reportTypeId: number;
}

export interface CompareGroup {
    compareGroupId: number;
    name: string;
    lastModification: Date;
}

export const reportTypes = [ 1 ];

export const reportTypeMapping: { [key: number]: string } = {
    1: 'Compare Group Trend'
}

export const statusMapping: { [key: number]: string } = {
    1: 'Pending',
    2: 'Processing',
    3: 'Ready',
    4: 'Failed'
}