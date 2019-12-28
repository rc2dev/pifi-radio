import React, { useState } from 'react';
import Modal from './common/modal';
import { toast } from 'react-toastify';
import { playURL } from '../services/playerService';
import { withTranslation } from 'react-i18next';

const URLDialog = ({ t }) => {
  const [url, setURL] = useState('');

  const okDisabled = url === '';

  const handleCancel = () => {
    setURL('');
  };

  const handleOK = () => {
    doPlayURL(url);
    setURL('');
  };

  const doPlayURL = async url => {
    const errorToastOpts = {
      type: toast.TYPE.ERROR,
      render: t('errorNotFound')
    };

    const toastId = toast(t('tryingURL'));

    try {
      await playURL(url);
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.update(toastId, errorToastOpts);
    }
  };

  const handleChange = ({ target: input }) => {
    setURL(input.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !okDisabled) handleOK();
  };

  const renderFooter = () => (
    <React.Fragment>
      <button
        className="btn btn-primary"
        onClick={handleOK}
        disabled={okDisabled}
        data-dismiss="modal"
      >
        OK
      </button>
      <button className="btn btn-secondary" data-dismiss="modal">
        Cancel
      </button>
    </React.Fragment>
  );

  return (
    <Modal id="url-dialog" title={t('playURL')} footer={renderFooter()}>
      <input
        className="form-control mb-4"
        type="text"
        placeholder="URL"
        value={url}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleCancel}
      />
    </Modal>
  );
};

export default withTranslation()(URLDialog);
