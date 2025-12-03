import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Drug Instructor heading', () => {
  render(<App />);
  const heading = screen.getByText(/Drug Instructor/i);
  expect(heading).toBeInTheDocument();
});
