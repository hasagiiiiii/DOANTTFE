// src/utils/NotificationService.ts
import { notification } from 'antd';
import React from 'react';

class NotificationService {
    static success(message: string | React.ReactNode, description?: string) {
        notification.success({
            message,
            description,
            placement: 'topRight',
            duration: 3,
        });
    }

    static error(message: string | React.ReactNode, description?: string) {
        notification.error({
            message,
            description,
            placement: 'topRight',
            duration: 4,
        });
    }

    static warning(message: string | React.ReactNode, description?: string) {
        notification.warning({
            message,
            description,
            placement: 'topRight',
            duration: 4,
        });
    }

    static info(message: string | React.ReactNode, description?: string) {
        notification.info({
            message,
            description,
            placement: 'topRight',
            duration: 3,
        });
    }
}

export default NotificationService;
