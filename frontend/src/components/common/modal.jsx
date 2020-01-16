import React from 'react';
import { useTranslation } from 'react-i18next';

const Modal = ({ id, title, footer, children }) => {
  const { t } = useTranslation();

  const defaultFooter = (
    <button className="btn btn-secondary" data-dismiss="modal">
      {t('close')}
    </button>
  );

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              {title}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">{footer ? footer : defaultFooter}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
