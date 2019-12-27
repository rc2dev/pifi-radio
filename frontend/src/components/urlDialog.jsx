import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from 'reactstrap';
import { toast } from 'react-toastify';
import { playURL } from '../services/playerService';
import { withTranslation } from 'react-i18next';

const URLDialog = ({ isOpen, toggle, t }) => {
  const [url, setURL] = useState('');

  const handleOK = () => {
    toggle();

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

  const handleCancel = () => {
    toggle();
    setURL('');
  };

  const handleChange = ({ target: input }) => {
    setURL(input.value);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} id="play-url" autoFocus={false}>
      <ModalHeader toggle={toggle}>{t('playURL')}</ModalHeader>
      <ModalBody>
        <Input
          autoFocus={true}
          type="text"
          placeholder="URL"
          value={url}
          onChange={handleChange}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleOK}>
          OK
        </Button>{' '}
        <Button color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default withTranslation()(URLDialog);
