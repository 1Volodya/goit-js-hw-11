import axios from 'axios';

export class ImageSearch {
  #apiKey = '40635917-db33a317d93be5827193fa0c0';

  async searchImages(query, page = 1) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: this.#apiKey,
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: page,
          per_page: 40,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  }
}
