const DEFAULT_THEME = 'darkly';

const STORAGE_KEY = 'theme';

const getThemePath = themeId =>
  `https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/${themeId}/bootstrap.min.css`;

export const themes = [
  { id: 'darkly', name: 'Darkly', themeColor: '#375a7f' },
  { id: 'lux', name: 'Lux', themeColor: '#1a1a1a' }
];

export function changeTheme(themeId) {
  localStorage.setItem(STORAGE_KEY, themeId);
  applyTheme();
}

export function applyTheme() {
  const themeId = getThemeId();
  const themePath = getThemePath(themeId);
  const themeColor = themes.find(t => t.id === themeId).themeColor;

  const linkEl = document.querySelector('link[title="theme"]');
  linkEl.setAttribute('href', themePath);

  const metaEl = document.querySelector('meta[name="theme-color"]');
  metaEl.setAttribute('content', themeColor);
}

export function getThemeId() {
  const localId = localStorage.getItem(STORAGE_KEY);

  if (localId === '') return DEFAULT_THEME;
  if (themes.filter(t => t.id === localId).length === 0) {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_THEME;
  }

  return localId;
}
