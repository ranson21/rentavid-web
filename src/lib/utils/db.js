// db.js
import Dexie from 'dexie';

export const db = new Dexie('rentavidCart');
db.version(1).stores({
	cart: '++id,dvdId, title' // Primary key and indexed props
});
