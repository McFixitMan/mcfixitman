import { UserRole } from 'mcfixitman.shared/enums/userRole';

// Map AD Groups to UserRoles
export const adUserRolesMap: Map<string, number> = new Map<string, UserRole>([
    ['mcfixitman Read', UserRole.READ_ONLY],
    ['mcfixitman Admin', UserRole.ADMIN],
    ['mcfixitman SuperUser', UserRole.SUPERUSER],
]);