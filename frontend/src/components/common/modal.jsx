import React from 'react';
import { useTranslation } from 'react-i18next';

const Modal = ({ id, title, footer, children }) => {
  const { t } = useTranslation();

  const defaultFooter = (
    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
      {t('close')}
    </button>
  );

  return (
    <div className="modal fade" id={id} tabindex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">{footer ? footer : defaultFooter}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
