import {observableFocusTrap} from '../tests/observableFocusTrap';
import './app.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Ally UI Focus Trap</h1>
    <button id="enable">enable trap</button>
    <div id="trap">
      <button id="username">username</button>
      <button id="password">password</button>
      <button id="disable">disable trap</button>
    </div>
  </div>
`;

const trapElement = document.querySelector<HTMLDivElement>('#trap')!;
const trap = observableFocusTrap();
trap.onBind(trapElement);
const enableElement = document.querySelector<HTMLDivElement>('#enable')!;
enableElement.addEventListener('click', () => trap.activate());
const disableElement = document.querySelector<HTMLDivElement>('#disable')!;
disableElement.addEventListener('click', () => trap.deactivate());
