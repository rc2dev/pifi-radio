import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Modal from '../common/modal';
import { playURL } from '../../services/playerService';

const URLDialog = () => {
  const [url, setURL] = useState('');

  const { t } = useTranslation();

  const handleOK = () => {
    if (url === '') return;
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
    if (e.key === 'Enter') handleOK();
  };

  const renderFooter = () => (
    <>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setURL('')}>{t('cancel')}</button>
      <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleOK}>{t('ok')}</button>
    </>
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
      />
    </Modal>
  );
};

export default URLDialog;
