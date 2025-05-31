// src/utils/NotificationService.ts
import { notification } from 'antd';

class NotificationService {
    static success(message: string, description?: string) {
        notification.success({
            message,
            description,
            placement: 'topRight',
            duration: 3,
        });
    }

    static error(message: string, description?: string) {
        notification.error({
            message,
            description,
            placement: 'topRight',
            duration: 4,
        });
    }

    static warning(message: string, description?: string) {
        notification.warning({
            message,
            description,
            placement: 'topRight',
            duration: 4,
        });
    }

    static info(message: string, description?: string) {
        notification.info({
            message,
            description,
            placement: 'topRight',
            duration: 3,
        });
    }
}

export default NotificationService;
