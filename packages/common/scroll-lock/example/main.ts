import {observableScrollLock} from '../tests/observableScrollLock';
import './app.css';

const LONG_TEXT = `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus ratione, non ex similique culpa, repudiandae error quo cum, cupiditate doloremque qui consectetur adipisci veniam numquam esse. Quo architecto quam impedit dolorum deleniti fugiat nulla quis aliquid, cumque praesentium perferendis at quae soluta blanditiis. Voluptatum ea minus veritatis laboriosam fugit error aperiam possimus veniam, blanditiis omnis? Aspernatur nulla unde ipsa neque sapiente, natus harum alias ex eligendi accusantium repudiandae totam expedita debitis? Similique inventore praesentium distinctio, architecto libero animi at veniam cum beatae tempore provident? Explicabo exercitationem pariatur ducimus provident, vel sit error sed doloribus voluptates nisi totam aliquam enim veritatis?`;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Ally UI Scroll Lock</h1>
    <div style="position:sticky;top:0;background:white;">
      <button id="enable">Enable</button>
      <button id="disable">Disable</button>
      <div id="except" style="height:25vh;overflow:auto;">
        <p>${LONG_TEXT}</p>
        <p>${LONG_TEXT}</p>
      </div>
    </div>
    <section>
      <p>${LONG_TEXT}</p>
      <p>${LONG_TEXT}</p>
      <p>${LONG_TEXT}</p>
      <p>${LONG_TEXT}</p>
      <p>${LONG_TEXT}</p>
      <p>${LONG_TEXT}</p>
    </section>
  </div>
`;

const exceptElement = document.querySelector<HTMLDivElement>('#except')!;
const lock = observableScrollLock({container: exceptElement});
const enableElement = document.querySelector<HTMLButtonElement>('#enable')!;
enableElement.addEventListener('click', () => lock.activate());
const disableElement = document.querySelector<HTMLButtonElement>('#disable')!;
disableElement.addEventListener('click', () => lock.deactivate());
