
export interface RefreshToken {
    id: number;
    memberId: number;
    deviceUUID: string;
    tokenHash: string;
    dateCreated?: Date;
    lastUpdated?: Date;
}