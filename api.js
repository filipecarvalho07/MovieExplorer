const API_ROOT = 'https://api.themoviedb.org/3';
const IMAGE_ROOT = 'https://image.tmdb.org/t/p/';

export function createTmdbClient(apiKey) {
  if (!apiKey) {
    throw new Error('Adicione sua chave TMDB em Configurações para continuar.');
  }

  async function request(path, params = {}) {
    const url = new URL(API_ROOT + path);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('language', 'pt-BR');

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    const response = await fetch(url);

    if (!response.ok) {
      const message = response.status === 401
        ? 'Chave TMDB inválida. Confira as Configurações.'
        : 'TMDB respondeu com erro (' + response.status + ').';

      throw new Error(message);
    }

    return response.json();
  }

  return {
    searchMovies: async (query, page = 1) => {
      const data = await request('/search/movie', {
        query,
        page,
        include_adult: 'false',
      });

      return data.results.map(normalizeMovie);
    },

    popularMovies: async (page = 1) => {
      const data = await request('/movie/popular', { page });
      return data.results.map(normalizeMovie);
    },

    movieDetails: id => request('/movie/' + id, {
      append_to_response: 'credits',
    }),
  };
}

export function normalizeMovie(movie) {
  const genreIds = movie.genre_ids || [];

  return {
    id: 'tmdb-' + movie.id,
    tmdbId: movie.id,
    title: movie.title || movie.name,
    original_title: movie.original_title || '',
    year: movie.release_date
      ? Number(movie.release_date.slice(0, 4))
      : null,
    genre: genreIds.map(id => GENRES[id]).find(Boolean) || 'Filme',
    genres: genreIds.map(id => GENRES[id]).filter(Boolean),
    rating: Number(movie.vote_average || 0),
    votes: movie.vote_count || 0,
    overview: movie.overview || 'Sinopse não disponível.',
    poster: movie.poster_path
      ? IMAGE_ROOT + 'w500' + movie.poster_path
      : '',
    backdrop: movie.backdrop_path
      ? IMAGE_ROOT + 'w1280' + movie.backdrop_path
      : '',
    runtime: null,
    director: null,
  };
}

const GENRES = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção científica',
  10770: 'Cinema TV',
  53: 'Suspense',
  10752: 'Guerra',
  37: 'Faroeste',
};

// Factory de referência: configure URL e chave no seu projeto Back4App antes de ativar.
export function createParseClient({ serverUrl, appId, javascriptKey }) {
  if (!serverUrl || !appId || !javascriptKey) {
    throw new Error('Configure serverUrl, appId e javascriptKey do Back4App.');
  }

  async function request(path, { method = 'GET', body } = {}) {
    const baseUrl = serverUrl.replace(/\/$/, '');
    const response = await fetch(baseUrl + '/classes/' + path, {
      method,
      headers: {
        'X-Parse-Application-Id': appId,
        'X-Parse-Javascript-Key': javascriptKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error('Back4App respondeu com erro (' + response.status + ').');
    }

    return response.status === 204 ? null : response.json();
  }

  return {
    list: (className, where = {}) => {
      const query = encodeURIComponent(JSON.stringify(where));
      return request(className + '?where=' + query);
    },

    create: (className, record) => request(className, {
      method: 'POST',
      body: record,
    }),

    update: (className, id, record) => request(className + '/' + id, {
      method: 'PUT',
      body: record,
    }),

    remove: (className, id) => request(className + '/' + id, {
      method: 'DELETE',
    }),
  };
}
