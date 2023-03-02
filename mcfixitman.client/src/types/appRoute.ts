import { UserRole } from 'mcfixitman.shared/enums/userRole';

export interface AppRoute {
    titleKey?: string;
    title?: string;
    path: string;
    component: React.ReactNode;
    icon?: React.ReactNode;
    groupName?: string;
    isProtected?: boolean;
    allowedRoles?: Array<UserRole>;
    showInMenu?: boolean;
    groupOrder?: number;
}