import { MemberScopes, Members } from 'src/models/dataModels/member';

import { Member } from 'mcfixitman.shared/models/dataModels/member';
import { Transaction } from 'sequelize';

export const getMemberById = async (params: { memberId: number }): Promise<Member | undefined> => {
    const member = await Members.findByPk(params.memberId, {

    });

    return member?.get();
};

export const getMemberByEmailAddress = async (params: { emailAddress: string; scope?: MemberScopes; transaction?: Transaction }): Promise<Member | undefined> => {
    const member = await Members
        .scope(params.scope)
        .findOne({
            where: {
                emailAddress: params.emailAddress,
            },
            transaction: params.transaction,
        });

    return member?.get();
};