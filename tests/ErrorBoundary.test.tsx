import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

function Bomb() {
  throw new Error('boom-test');
}

const orig = console.error;
beforeAll(() => {
  console.error = () => {};
});
afterAll(() => {
  console.error = orig;
});

test('ErrorBoundary catches errors', () => {
  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );
  expect(screen.getByRole('alert')).toBeInTheDocument();
});