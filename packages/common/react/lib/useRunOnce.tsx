import {useState} from 'react';

export default function useRunOnce<TReturn>(runner: () => TReturn) {
	const [value] = useState(runner);
	return value;
}
