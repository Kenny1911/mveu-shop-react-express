import React from 'react';

interface ModalBoxArgs {
    closeModalBox: () => void,
    children: JSX.Element
}

const ModalBox = ({closeModalBox, children}: ModalBoxArgs) => {
    return (
        <div className="modal-box">
            <div className="modal-box__modal">
                <button className="modal-box__close-btn" onClick={() => closeModalBox()}>×</button>
                { children }
            </div>
            <div className="modal-box__bg" onClick={() => closeModalBox()}></div>
        </div>
    )
}

export default ModalBox