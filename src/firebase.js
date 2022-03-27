import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
const config = {
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

firebase.initializeApp(config);
const db = firebase.database();

export default db;