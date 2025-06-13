import { Modal } from "antd";
import React from "react";
interface ModalOption {
    title?: string | React.ReactNode;
    content?: React.ReactNode;
    onOk?: () => void;
    onCancel?: () => void;
    afterClose?: () => void;
    width?: string | number | undefined,
    height?: string | number | undefined,

}
const ModalCommon = {
    Show(data: ModalOption) {
        return Modal.info({
            title: data.title,
            content: data.content,
            onOk: data.onOk,
            onCancel: data.onCancel,
            afterClose: data.afterClose,
            closable: true,
            width: data.width,
            icon: null,
            footer: null,
            getContainer: document.getElementById('root') as HTMLElement,
            height: data.height,
        })
    },

    showInfo(data: ModalOption) {
        Modal.info({
            title: data.title, content: data.content, onOk: data.onOk, onCancel: data.onCancel, afterClose: data.afterClose

        })
    },
    showSucce(data: ModalOption) {
        Modal.success({
            title: data.title, content: data.content, onOk: data.onOk, onCancel: data.onCancel, afterClose: data.afterClose, width: data.width

        })
    },
    showError(data: ModalOption) {
        Modal.error({
            title: data.title, content: data.content, onOk: data.onOk, onCancel: data.onCancel, afterClose: data.afterClose

        })
    },
    showWaning(data: ModalOption) {
        Modal.warning({
            title: data.title, content: data.content, onOk: data.onOk, onCancel: data.onCancel, afterClose: data.afterClose

        })
    },
}
export default ModalCommon