import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { ImageSearch } from './galary-api';

const refs = {
  formElem: document.querySelector('.search-form'),
  galleryElem: document.querySelector('.gallery'),
  loadingElem: document.querySelector('.loading'),
  errorElem: document.querySelector('.error'),
  btnLoadElem: document.querySelector('.load-more'),
};

let currentPage = 1;
const imageSearch = new ImageSearch();
let lastSearchQuery = '';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: '',
  captionDelay: 250,
});

refs.formElem.addEventListener('submit', renderGallery);
refs.btnLoadElem.addEventListener('click', onLoadMoreClick);
refs.formElem.elements.searchQuery.addEventListener('input', handleInputChange);

async function renderGallery(e) {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value.trim();

  currentPage = 1;

  if (searchQuery === '') {
    Notiflix.Notify.warning('Please enter a search query.');

    return;
  }
  if (searchQuery === lastSearchQuery) {
    Notiflix.Notify.warning('This search query has already been submitted.');

    return;
  }

  try {
    showLoading(true);

    const data = await imageSearch.searchImages(searchQuery);

    if (data.hits.length === 0) {
      showNoResultsMessage(searchQuery);
      showLoading(false);
      hideButton();
      setTimeout(() => {
        location.reload(); 
      }, 2500);
      return;
    }

    const markup = articlesTemplate(data.hits);
    refs.galleryElem.innerHTML = markup;
    showLoading(false);
    refs.btnLoadElem.removeAttribute('disabled');
    showTotalHitsMessage(data.totalHits);
    showButton();
    lastSearchQuery = searchQuery;
    lightbox.refresh();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error fetching images:', error);
    showError('Error fetching images. Please try again.');
  }
}

function showNoResultsMessage(searchQuery) {
  Notiflix.Notify.info(
    `Sorry, there are no images matching your search query "${searchQuery}". Please try again.`
  );
  showLoading(false);
  clearGallery();
  
}

function showLoading(isLoading) {
  if (isLoading) {
    refs.loadingElem.classList.remove('is-hidden');
    refs.btnLoadElem.classList.add('is-hidden');
  } else {
    refs.loadingElem.classList.add('is-hidden');
    showButton();
  }
}
function showButton() {
  refs.btnLoadElem.classList.remove('is-hidden');
}
function hideButton() {
  refs.btnLoadElem.classList.add('is-hidden');
}

function showError(message) {
  refs.errorElem.textContent = message;
  refs.btnLoadElem.setAttribute('disabled', true);
}

function showTotalHitsMessage(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

async function onLoadMoreClick(e) {
  e.preventDefault();

  const searchQuery = refs.formElem.elements.searchQuery.value.trim();
  currentPage += 1;
  try {
    showLoading(true);

    const data = await imageSearch.searchImages(searchQuery, currentPage);
    const markup = articlesTemplate(data.hits);
    refs.galleryElem.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    showLoading(false);
    refs.btnLoadElem.removeAttribute('disabled');

    if (data.hits.length === 0) {
      refs.btnLoadElem.style.display = 'none';
      showEndOfResultsMessage();
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    showError('Error fetching images. Please try again.');
  }
}

function showEndOfResultsMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function handleInputChange() {
  const searchQuery = refs.formElem.elements.searchQuery.value.trim();
  refs.btnLoadElem.disabled = searchQuery === '';
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
  <ul class="info">
  <li class="info-item">
    <p class="info-taxt">Likes:</p>
    <p>${likes}</p>
  </li>
  <li class="info-item">
    <p class="info-taxt">Views:</p>
    <p>${views}</p>
  </li>
  <li class="info-item">
    <p class="info-taxt">Comments:</p>
    <p>${comments}</p>
  </li>
  <li class="info-item">
    <p class="info-taxt">Downloads:</p>
    <p>${downloads}</p>
  </li>
</ul>
</div>
  `;
}

function articlesTemplate(articles) {
  const markup = articles.map(articleTemplate).join('');
  return markup;
}

function clearGallery() {
  refs.galleryElem.innerHTML = '';
}
