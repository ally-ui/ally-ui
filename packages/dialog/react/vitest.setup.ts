import {matchers} from '@ally-ui/dev';
import '@testing-library/jest-dom';

expect.extend(matchers);

globalThis.CSS.supports = () => true;
