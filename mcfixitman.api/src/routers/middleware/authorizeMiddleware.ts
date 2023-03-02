import { ControllerAction } from 'src/types/controllerAction';
import { HttpStatusCode } from 'mcfixitman.shared/constants/httpStatusCode';
import { UserRole } from 'mcfixitman.shared/enums/userRole';

export const authorize = (...allowedRoles: Array<UserRole>): ControllerAction<void> => {
    return async (req, res, next) => {
        const { member } = req;

        if (!member) {
            // No member means they're not authenticated
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .send({
                    isError: true,
                    defaultMessage: 'Unauthorized',
                    key: 'Common.unauthorized',
                });
        }

        if (allowedRoles.length === 0) {
            // The user is authenticated, and no 'allowedRoles' were supplied, so good enough. 
            // Pass it through to the controller
            return next();
        }

        // let isAuthorized = false;

        // for (const role of adUser.roles) {
        //     if (allowedRoles.includes(role)) {
        //         // The user has one of the allowed roles
        //         isAuthorized = true;

        //         break;
        //     }
        // }

        // if (isAuthorized) {
        //     // User is authorized, pass it through to the controller
        //     return next();
        // } else {
        //     // Not authorized
        //     return res
        //         .status(HttpStatusCode.FORBIDDEN)
        //         .send({
        //             isError: true,
        //             defaultMessage: 'Forbidden',
        //             key: 'Common.forbidden',
        //         });
        // }

        return res
            .status(HttpStatusCode.FORBIDDEN)
            .send({
                isError: true,
                defaultMessage: 'Forbidden',
                key: 'Common.forbidden',
            });
    };
};