import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Observable } from 'rxjs';

// AppModule
import { AppModule } from './app';

// common styles
import './common/styles.scss';

const debuggerOn = true;

Observable.prototype.debug = function (message:string) {
return this.do(
  nextValue => {
    if(debuggerOn)
    {
      console.log(new Date().toUTCString());
    }
  },
  error => {
     if(debuggerOn) {
       console.error(message, error)
     }
  },
  ()=> {
      if(debuggerOn) {
       console.log('observable completed - ', message);
     }
  }
);
}

declare module 'rxjs/Observable' {
  interface Observable<T> {
    debug: (...any) => Observable<T>
  }
}


if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}
enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
