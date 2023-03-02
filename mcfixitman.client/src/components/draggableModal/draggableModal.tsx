import * as React from 'react';

import Draggable, { DraggableBounds, DraggableData, DraggableEvent } from 'react-draggable';
import { Modal, ModalProps } from 'antd';

interface DraggableModalProps extends ModalProps {

}

export const DraggableModal: React.FC<DraggableModalProps> = (props) => {
    const [isDisabled, setIsDisabled] = React.useState(true);
    const [bounds, setBounds] = React.useState<DraggableBounds>({ bottom: 0, left: 0, right: 0, top: 0 });

    const dragRef = React.createRef<HTMLDivElement>();

    const onStart = (event: DraggableEvent, uiData: DraggableData): void => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = dragRef.current?.getBoundingClientRect();

        if (!targetRect) {
            return;
        }

        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    return (
        <Modal
            {...props}
            title={
                <div
                    style={{ width: '100%', cursor: 'move' }}
                    onMouseOver={() => {
                        if (isDisabled) {
                            setIsDisabled(false);
                        }
                    }}
                    onMouseOut={() => {
                        setIsDisabled(true);
                    }}
                >
                    {props.title}
                </div>
            }
            modalRender={(modal) => (
                <Draggable
                    disabled={isDisabled}
                    bounds={bounds}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={dragRef}>{modal}</div>
                </Draggable>

            )}
        >
            {props.children}
        </Modal>
    );
};