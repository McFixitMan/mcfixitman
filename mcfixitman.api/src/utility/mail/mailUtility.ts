import * as nodemailer from 'nodemailer';
import * as smtpConnection from 'nodemailer/lib/smtp-connection';

import config from 'src/config';

const connectionOptions: smtpConnection.Options = {
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    connectionTimeout: config.mail.connectionTimeoutMilliseconds,
    auth: config.mail.useAuth
        ?
        {
            user: config.mail.emailUser,
            pass: config.mail.emailPassword,
        }
        :
        {},
    ignoreTLS: config.mail.ignoreTLS,
    tls: {
        rejectUnauthorized: true,
    },
};

export const sendMail = async (params: { to: Array<string>; subject: string; message: string; }): Promise<boolean> => {
    const transporter = nodemailer.createTransport(connectionOptions);

    const result = await transporter.sendMail({
        from: {
            address: config.mail.fromAddress,
            name: config.mail.fromName,
        },
        to: params.to,
        subject: params.subject,
        text: params.message,
        html: `<div>${params.message}</div>`,
    });

    transporter.close();

    if (result.accepted.length >= 1) {
        return true;
    } else {
        return false;
    }
};