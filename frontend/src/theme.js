const DEFAULT_THEME_ID = 'darkly';

const STORAGE_KEY = 'theme';

const getThemePath = (themeId) => `/vendor/bootswatch_4.4.1/${themeId}.min.css`;

const availableThemes = [
  { id: 'darkly', name: 'Darkly', themeColor: '#375a7f' },
  { id: 'lux', name: 'Lux', themeColor: '#1a1a1a' }
];

function change(themeId) {
  localStorage.setItem(STORAGE_KEY, themeId);
  apply();
}

function apply() {
  const themeId = getCurrentId();
  const themePath = getThemePath(themeId);
  const themeColor = availableThemes.find(t => t.id === themeId).themeColor;

  const linkEl = document.querySelector('link[title="theme"]');
  linkEl.setAttribute('href', themePath);

  const metaEl = document.querySelector('meta[name="theme-color"]');
  metaEl.setAttribute('content', themeColor);
}

function getCurrentId() {
  const localId = localStorage.getItem(STORAGE_KEY);

  if (localId === '') return DEFAULT_THEME_ID;
  if (availableThemes.filter(t => t.id === localId).length === 0) {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_THEME_ID;
  }

  return localId;
}

export default {
  availableThemes,
  getCurrentId,
  change,
  apply
};
