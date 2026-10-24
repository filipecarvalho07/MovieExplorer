const PREFIX = 'movie-explorer:';

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(PREFIX + key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
};

export const library = {
  getAll: () => read('library', []),
  get: key => read(key, []),
  set: (key, value) => write(key, value),

  toggle(key, movie) {
    const items = read(key, []);
    const exists = items.some(item => String(item.id) === String(movie.id));
    const next = exists
      ? items.filter(item => String(item.id) !== String(movie.id))
      : [movie, ...items];

    write(key, next);
    return !exists;
  },

  has(key, id) {
    return read(key, []).some(item => String(item.id) === String(id));
  },

  upsert(movie) {
    const items = read('library', []);
    const next = [
      movie,
      ...items.filter(item => String(item.id) !== String(movie.id)),
    ];

    write('library', next);
    return next;
  },

  remove(id) {
    const items = read('library', [])
      .filter(item => String(item.id) !== String(id));

    write('library', items);
    return items;
  },

  rating(id) {
    return read('ratings', {})[id] || 0;
  },

  rate(id, value) {
    const ratings = read('ratings', {});
    ratings[id] = value;
    write('ratings', ratings);
  },

  getRatings() {
    return read('ratings', {});
  },

  getActivity: () => read('activity', []),

  addActivity(entry) {
    const activity = read('activity', []);
    activity.unshift(entry);
    write('activity', activity.slice(0, 30));
  },

  apiKey: () => read('settings', {}).tmdbKey || '',
  settings: () => read('settings', {}),

  saveSettings(settings) {
    write('settings', settings);
  },
};
