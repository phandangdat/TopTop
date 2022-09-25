import React from 'react';
import Popup from 'reactjs-popup';
import ModalLogin from '~/layouts/components/ModalLogin';

export default function PopupLogin({ children }) {
  return (
    <Popup lockScroll modal closeOnDocumentClick={false} trigger={children}>
      {(close) => <ModalLogin close={close} />}
    </Popup>
  );
}
