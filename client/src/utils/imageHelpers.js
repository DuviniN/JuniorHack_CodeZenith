const buildUnsplashUrl = (query, size = '600x400') =>
  `https://source.unsplash.com/featured/${size}/?${encodeURIComponent(query)}`;

export const getFoodImage = (name = 'sri lankan cuisine') =>
  buildUnsplashUrl(`${name} sri lankan food`);

export const getAdvisorImage = (name = 'nutritionist') =>
  buildUnsplashUrl(`${name} sri lanka wellness`, '480x480');

