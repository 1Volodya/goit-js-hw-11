import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchImages } from './galary-api';

const refs = {
  formElem: document.querySelector('.search-form'),
  galleryElem: document.querySelector('.gallery'),
  loadingElem: document.querySelector('.loding'),
  errorElem: document.querySelector('.error'),
  btnLoadElem: document.querySelector('.btn-load'),
};

refs.formElem.addEventListener('submit', renderGallery);

async function renderGallery(e) {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();
  try {
    const data = await searchImages(searchQuery);
    const markup = articlesTemplate(data.hits);
    refs.galleryElem.innerHTML = markup;
    new SimpleLightbox('.gallery a', {
      captionsData: '',
      captionDelay: 250,
    });
    refs.errorElem.textContent = '';
    refs.btnLoadElem.removeAttribute('disabled');
  } catch (error) {
    console.error('Error fetching images:', error);
    refs.errorElem.textContent = 'Error fetching images. Please try again.';
    refs.btnLoadElem.setAttribute('disabled', true);
  }
}

function articleTemplate({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <div class="photo-card">
      <a href="${webformatURL}" data-lightbox="image">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${downloads}
        </p>
      </div>
    </div>
  `;
}

function articlesTemplate(articles) {
  const markup = articles.map(articleTemplate).join('');
  return markup;
}
