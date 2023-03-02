import { UserRole } from 'mcfixitman.shared/enums/userRole';

export const useAuthorize = (): { isUserInRole: (...roles: Array<UserRole>) => boolean; } => {
    // const userRoles = useAppSelector((state) => state.security.member?.roles ?? []);
    const userRoles: Array<UserRole> = [];

    const isUserInRole = (...roles: Array<UserRole>): boolean => {
        for (const userRole of userRoles) {
            if (roles.includes(userRole)) {
                return true;
            }
        }

        return false;
    };

    return {
        isUserInRole,
    };
};