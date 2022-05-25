export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database `shop-shop` with the version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to the database, transaction (tx), and object store
    let db, tx, store;

    // if version has changed (or if this is the first time using the database), run this method and create the three object stores
    request.onupgradeneeded = function(e) {
      const db = request.result;

      // create object store for each type of data and set "primary" key index to the `_id` of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // handle any errors with connecting
    request.onerror = function(e) {
      console.log('There was an error');
    };

    // on database open success
    request.onsuccess = function(e) {
      // save a reference of the database to the `db` variable
      db = request.result;
      // open a transaction do whatever we pass into `storeName` (must match one of the object store names)
      tx = db.transaction(storeName, 'readwrite');
      //save a reference to that object store 
      store = tx.objectStore(storeName);

      // if there's any errors, let us know 
      db.onerror = function(e) {
        console.log('error', e);
      }

      // use switch statement to check the value of the method.
      switch (method) {
        case 'put':
          // run .put method on object store, overwriting any data with the matching _id value from the object and adding it if it cant find a match.
          store.put(object);
          resolve(object);
          break;
        case 'get': 
          // we'll simply get all data from that store and return it. Both put and get will return the data wherever we call this idbPromise()
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          // we'll delete that item from the object store. This option will come in handy if users want to remove an item from the shopping cart while offline.
          store.delete(object._id);
          break;
        default: 
          console.log('No valid method');
          break;
      }

      // when the transaction is complete, close the connection
      tx.oncomplete = function() {
        db.close();
      };
    };

  });
}