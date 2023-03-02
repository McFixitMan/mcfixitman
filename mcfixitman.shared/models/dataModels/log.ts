
export interface Log {
    id: number;
    createdAt: Date;
    errorMessage: string;
    errorType: string;
    stacktrace?: string;
    createdBy?: string;
}