import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './common/modal';
import { getConfig } from '../services/configService';

const About = () => {
  const { t } = useTranslation();

  const [config, setConfig] = useState({});

  useEffect(() => {
    async function fetchData() {
      const { data: config } = await getConfig();
      setConfig(config);
    }
    fetchData();
  }, []);

  const data = [
    { label: t('mpdHost'), value: config.mpd_host },
    { label: t('mpdPort'), value: config.mpd_port },
    { label: t('environment'), value: config.environment },
    { label: t('version'), value: config.version }
  ];

  return (
    <Modal id="about" title={t('about')}>
      <table className="table">
        <tbody>
          {data.map(item => (
            <tr key={item.label}>
              <th scope="row">{item.label}</th>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="small mt-5">
        Copyright &copy; 2017-2020&nbsp;
        {/* Use the default color, as some themes give a different color for links. */}
        <a
          href="https://rafaelc.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit' }}
        >
          Rafael Cavalcanti
        </a>
      </p>
    </Modal>
  );
};

export default About;
