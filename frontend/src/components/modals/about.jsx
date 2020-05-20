import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/modal';
import { getConfig } from '../../services/configService';
import Loader from '../common/loader';

const About = () => {
  const { t } = useTranslation();

  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: config } = await getConfig();
      setConfig(config);
      setLoading(false);
    }
    fetchData();
  }, []);

  const tableData = [
    { label: t('mpdHost'), value: config.mpd_host },
    { label: t('mpdPort'), value: config.mpd_port },
    { label: t('environment'), value: config.environment },
    { label: t('version'), value: config.version },
  ];

  const renderTable = () => {
    if (loading) return <Loader />;

    return (
      <table className="table">
        <tbody>
          {tableData.map((item) => (
            <tr key={item.label}>
              <th scope="row">{item.label}</th>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const copyright = (
    <div className="copyright small mt-5">
      <p>
        <a
          href="https://github.com/rccavalcanti/pifi-radio/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit' }}
        >
          {t('goToDocs')}
        </a>
      </p>
      <p>
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
    </div>
  );

  const coffee = (
    <div className="coffee mt-5">
      <p>{t('coffee')}</p>
      <a
        href="https://www.buymeacoffee.com/rafaelc"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/default-blue.png"
          alt="Buy Me A Coffee"
          style={{ height: 51, width: 217 }}
        />
      </a>
    </div>
  );

  return (
    <Modal id="about" title={t('about')}>
      {renderTable()}
      {coffee}
      {copyright}
    </Modal>
  );
};

export default About;
