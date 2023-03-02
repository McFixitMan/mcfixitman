import '@testing-library/jest-dom';

import App from './app';
import React from 'react';
import { render } from '@testing-library/react';

describe('the App component', () => {
    it('renders without crashing', () => {
        render(<App />);
    });
});
