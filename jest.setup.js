import '@testing-library/jest-dom';

// Fix for "TextEncoder is not defined" error
import { TextEncoder, TextDecoder } from "util";
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
