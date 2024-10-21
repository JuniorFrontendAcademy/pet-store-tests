import type { JSX } from 'react';

import logoUrl from 'src/logo.png';
import { formatDate } from '~helpers';

export const App = (): JSX.Element => (
  <div className="text text-center">
    <div>Mock App</div>
    <div data-testid="date-label">{formatDate(new Date())}</div>
    <div>
      <img src={logoUrl} alt="logo" />
    </div>
  </div>
);
