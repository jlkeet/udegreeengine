import { AngularFireModule, AuthMethods } from 'angularfire2';


const firebaseConfig = {
    apiKey: "AIzaSyBFjOpqFTnMyTVy3mT9-zvVJkl3_xh1qp0",
    authDomain: "tmhtest-24418.firebaseapp.com",
    databaseURL: "https://tmhtest-24418.firebaseio.com",
    storageBucket: "tmhtest-24418.appspot.com",
    messagingSenderId: "1099495352125"
};

const firebaseAuthConfig = {
  method: AuthMethods.Popup,
  remember: 'default'
};


export const FirebaseModule = AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig);
