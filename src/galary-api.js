import axios from 'axios';

const API_KEY = '40635917-db33a317d93be5827193fa0c0';

export async function searchImages(query, page = 1) {
  try {
    const response = await axios
      .get('https://pixabay.com/api/', {
        params: {
          key: API_KEY,
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: page,
          per_page: 40,
        },
      })
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching images:', error);
        throw error;
      });

    return response;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
