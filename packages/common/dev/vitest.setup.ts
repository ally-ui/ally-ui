import '@testing-library/jest-dom';
import {matchers} from './lib/main';

expect.extend(matchers);

globalThis.CSS.supports = () => true;
