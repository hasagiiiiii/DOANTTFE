import React from 'react';
import { Button, Modal } from 'antd';

type ConfirmOptions = {
  title?: string | React.ReactNode;
  content?: string;
};
export enum MessageConfirm {
  OK,
  NO,
}
export const MessageConfirmModal = ({
  title,
  content,
}: ConfirmOptions): Promise<MessageConfirm> => {
  return new Promise((resolve) => {
    const modal = Modal.confirm({
      title: title || 'Xác nhận hành động',
      content: content || 'Bạn có chắc chắn muốn tiếp tục?',
      footer: [
        <div className="flex">
          <Button
            key="cancel"
            className="btn"
            onClick={() => {
              modal.destroy();
              resolve(MessageConfirm.NO);
            }}
          >
            ❌ Huỷ
          </Button>
          ,
          <Button
            key="ok"
            className="btn"
            onClick={() => {
              modal.destroy();
              resolve(MessageConfirm.OK);
            }}
          >
            ✅ Đồng ý
          </Button>
          ,
        </div>,
      ],
    });
  });
};
