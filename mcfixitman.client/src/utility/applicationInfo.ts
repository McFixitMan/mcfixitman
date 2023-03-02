export interface ApplicationInfo {
    name: string;
    version: string;
    build: string | undefined;
    // homepage: string;
}

import appInfo from '../../package.json';

const applicationInfo: ApplicationInfo = {
    name: appInfo.name,
    version: appInfo.version,
    build: appInfo.config?.build,
};

export { applicationInfo };
export default applicationInfo;