
export interface Member {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    passwordHash?: string;
    isAdmin: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}