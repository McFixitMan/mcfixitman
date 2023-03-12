import { Dialect } from 'sequelize';

export interface ConfigDb {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
    logging: boolean;
    force: boolean;
    timezone: string;
    port: number;
}

export interface ConfigSecurity {
    jwtSecret: string;
    issuer: string;
    audience: string;
    accessTokenDurationMinutes: number;
    refreshTokenDurationDays: number;
    allEntitiesRole: string;
}

export interface ConfigOpenAi {
    apiKey: string;
    organization: string;
}

export interface ConfigDiscord {
    botToken: string;
}

export interface ConfigMail {
    useAuth: boolean;
    emailUser: string;
    emailPassword: string;
    host: string;
    port: number;
    fromName: string;
    fromAddress: string;
    ignoreTLS: boolean;
    secure: boolean;
    connectionTimeoutMilliseconds: number;
}

export interface ConfigSetting {
    baseRoutePath: string;
    port: number;
    clientUrl: string;
    clientPath: string;
    security: ConfigSecurity;
    configDb: ConfigDb;
    openAi: ConfigOpenAi;
    discord: ConfigDiscord;
    mail: ConfigMail;
}

export interface ConfigSettings {
    [key: string]: ConfigSetting;
}

const config: ConfigSetting = {
    port: parseInt(process.env.PORT ?? '1337'),
    baseRoutePath: process.env.BASE_ROUTE_PATH ?? '/api',
    clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
    clientPath: process.env.CLIENT_PATH ?? '/client',
    configDb: {
        database: process.env.DATABASE ?? '',
        dialect: 'mysql',
        force: true,
        host: process.env.DATABASE_HOST ?? 'localhost',
        logging: false,
        password: process.env.DATABASE_PASSWORD ?? '',
        timezone: '+00:00',
        username: process.env.DATABASE_USERNAME ?? '',
        port: parseInt(process.env.DATABASE_PORT ?? '3306'),
    },
    security: {
        audience: 'mcfixitman',
        issuer: 'mcfixitman',
        refreshTokenDurationDays: parseInt(process.env.REFRESH_TOKEN_DURATION_DAYS ?? '30'),
        jwtSecret: process.env.JWT_SECRET ?? '',
        accessTokenDurationMinutes: parseInt(process.env.ACCESS_TOKEN_DURATION_MINUTES ?? '30'),
        allEntitiesRole: process.env.ALL_ENTITIES_ROLE ?? '',
    },
    openAi: {
        apiKey: process.env.OPEN_AI_API_KEY ?? '',
        organization: process.env.OPEN_AI_ORGANIZATION ?? '',
    },
    discord: {
        botToken: process.env.DISCORD_BOT_TOKEN ?? '',
    },
    mail: {
        connectionTimeoutMilliseconds: !!process.env.MAIL_CONNECTION_TIMEOUT_MS ? parseInt(process.env.MAIL_CONNECTION_TIMEOUT_MS) : 15000,
        emailPassword: process.env.MAIL_PASSWORD ?? '',
        emailUser: process.env.MAIL_USER ?? '',
        fromName: process.env.MAIL_FROM_NAME ?? 'McFixitMan',
        fromAddress: process.env.MAIL_FROM_ADDRESS ?? 'mailer@mcfixitman.com',
        host: process.env.MAIL_HOST ?? 'localhost',
        ignoreTLS: !!process.env.MAIL_IGNORE_TLS ? JSON.parse(process.env.MAIL_IGNORE_TLS) : true,
        port: !!process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 25,
        secure: !!process.env.MAIL_SECURE ? JSON.parse(process.env.MAIL_SECURE) : false,
        useAuth: !!process.env.MAIL_USE_AUTH ? JSON.parse(process.env.MAIL_USE_AUTH) : false,
    },
};

export { config };