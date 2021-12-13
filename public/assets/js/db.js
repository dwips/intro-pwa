var idxDb = idb.open('moviedb', 1, function (db) {
  if (!db.objectStoreNames.contains('movies')) {
    db.createObjectStore('movies', { keyPath: 'imdbID' });
  }
});

function writeData(storeName, data) {
  return idxDb.then(function (db) {
    var dbRef = db.transaction(storeName, 'readwrite');
    var store = dbRef.objectStore(storeName);
    store.put(data);
    return dbRef.complete;
  });
}

function readData(storeName) {
  return idxDb.then(function (db) {
    var dbRef = db.transaction(storeName, 'readonly');
    var store = dbRef.objectStore(storeName);
    return store.getAll();
  });
}
