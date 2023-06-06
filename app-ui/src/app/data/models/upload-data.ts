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