window.addEventListener('load', function () {
  initFetchMovie('star wars');
  onSearchChange();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serviceWorker.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function (err) {
      console.log(err);
    });
}

var omdbApi = 'http://www.omdbapi.com/?apikey=8758472a';

function initFetchMovie(search) {
  var searchUrl = omdbApi;

  if (search) {
    searchUrl = omdbApi + '&s=' + search;
  }

  var isNetworkDataReceived = false;

  fetch(searchUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      isNetworkDataReceived = true;
      createListMovie(res.Search);
    });

  if ('indexedDB' in window) {
    readData('movies').then(function (res) {
      if (!isNetworkDataReceived) {
        createListMovie(res);
      }
    });
  }
}

function getMovies(search) {
  var searchUrl = omdbApi;

  if (search) {
    searchUrl = omdbApi + '&s=' + search;
  }

  fetch(searchUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      createListMovie(res.Search);
    });
}

function onSearchChange() {
  var formElm = document.getElementById('search');
  formElm.addEventListener('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(this);
    getMovies(formData.get('search'));
  });
}

function createListMovie(data) {
  var cards = document.getElementById('list-movie');
  cards.innerHTML = '';

  try {
    data.forEach(function (movie) {
      // image
      var imgContent = document.createElement('img');
      imgContent.src = movie.Poster;

      // body
      var cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      cardBody.innerHTML = '<h3 class="card-text">' + movie.Title + '</h3>';

      // card
      var cardElm = document.createElement('div');
      cardElm.className = 'card shadow-sm';
      cardElm.appendChild(imgContent);
      cardElm.appendChild(cardBody);

      // card wrapper
      var cardWrapper = document.createElement('div');
      cardWrapper.className = 'col';
      cardWrapper.appendChild(cardElm);

      cards.appendChild(cardWrapper);
    });
  } catch (error) {
    console.log(error);
  }
}
