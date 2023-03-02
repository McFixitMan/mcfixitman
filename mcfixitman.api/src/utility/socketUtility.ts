import { ClientToServerEvents, ServerToClientEvents } from 'mcfixitman.shared/types/socketEvents';

import { Server } from 'socket.io';

export type SocketServer = Server<ClientToServerEvents, ServerToClientEvents>;

export const getDeviceConfigRoom = (deviceConfigId: number): string => {
    return `DeviceConfig:${deviceConfigId}`;
};

export const getFacilityRoom = (facilityId: number): string => {
    return `Facility:${facilityId}`;
};

export const getEmergencyAttendanceRoom = (facilityId: number): string => {
    return `Attendance:${facilityId}`;
};


export interface SocketMessages {
    sendExampleMessage: (message: string) => void;
}

export const getMessageHelper = (io?: SocketServer): SocketMessages => {
    return {
        sendExampleMessage: (message) => {
            io?.emit('exampleServerToClient', message);
        },
    };
};