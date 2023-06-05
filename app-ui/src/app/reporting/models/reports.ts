import { TrimLevel } from "../enums/reporting";

export interface DataSharingContactReport {
    name: string;
    standardDepartment: number | null;
    compareGroup: number | null;
}

export interface GeneralReportInfo {
    reportName: string;
    saveTemplate: boolean;
    runReport: boolean;
    runAndViewReport: boolean;
    includeReportSummarySection: boolean;
}

export interface CompareGroutTrendOptions {
    timePeriodType: string;
    timePeriod: number;
    standardDepartament: number;
    departament: number;
    compareGroups: number[];
    trimLevel: TrimLevel;
    percentile1: number;
    percentile2: number;
    percentile3: number;
    numberOfTimePeriods: number;
    measure: number;
}

export interface CompareGroupTrendReport {
    cgt: CompareGroutTrendOptions;
    gri: GeneralReportInfo;
}