export interface AppSetting {
    apiBaseUrl: string;
    baseURL: string;
    basePath: string;
    socketIoUrl: string;
}

const config: AppSetting = {
    basePath: process.env.REACT_APP_BASE_CLIENT_PATH || '/',
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:1337/api',
    baseURL: process.env.PUBLIC_URL || 'http://localhost:1337',
    socketIoUrl: process.env.REACT_APP_SOCKET_IO_URL || 'http://localhost:1337',
};

export { config };