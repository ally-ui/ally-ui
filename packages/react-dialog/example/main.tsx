import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import App from './App';
import './app.css';

const markup = ReactDOMServer.renderToString(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
console.log(markup);

ReactDOM.createRoot(document.getElementById('app')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
