import { TimePeriodStatus } from "../enums/general";

export interface Facility {
    id: number;
    name: string;
}

export interface TimePeriodInfo {
    id: number;
    status: TimePeriodStatus;
    timePeriod: TimePeriod;
}

export interface TimePeriod {
    if: number;
    shortName: string;
}

export interface SelectedDataPeriod {
  timePeriodInfo: TimePeriodInfo;
  facility: Facility;
}

export interface SelectedDataPeriodDto {
    facilityId: number;
    timePeriodInfoId: number;
}