import {observableScrollLock} from '../tests/observableScrollLock';
import './app.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Ally UI Scroll Lock</h1>
    <div style="position:sticky;top:0;">
      <button id="enable">Enable</button>
      <button id="disable">Disable</button>
    </div>
    <div style="height:200vh;">
    </div>
  </div>
`;

const lock = observableScrollLock({});
const enableElement = document.querySelector<HTMLButtonElement>('#enable')!;
enableElement.addEventListener('click', () => lock.activate());
const disableElement = document.querySelector<HTMLButtonElement>('#disable')!;
disableElement.addEventListener('click', () => lock.deactivate());
