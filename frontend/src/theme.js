const DEFAULT_THEME = 'darkly';

const LOCALSTORAGE_KEY = 'theme';

const getThemePath = theme =>
  `https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/${theme}/bootstrap.min.css`;

export const themes = ['darkly', 'lux', 'litera'];

export function changeTheme(theme) {
  localStorage.setItem(LOCALSTORAGE_KEY, theme);
  applyTheme();
}

export function applyTheme() {
  const theme = getTheme();
  const themePath = getThemePath(theme);

  const link = document.querySelector('link[title="theme"]');
  link.setAttribute('href', themePath);
}

export function getTheme() {
  const localValue = localStorage.getItem(LOCALSTORAGE_KEY);

  if (localValue === '') return DEFAULT_THEME;
  if (!themes.includes(localValue)) {
    localStorage.removeItem(LOCALSTORAGE_KEY);
    return DEFAULT_THEME;
  }

  return localValue;
}
