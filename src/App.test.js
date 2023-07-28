import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// This line tells Jest to replace axios with our mock function
jest.mock('axios');

test('mocks axios.post call', async () => {
  // Here we define what the mock function should return
  axios.post.mockResolvedValue({ data: 'mock data' });

  // Then we call our function that uses axios.post
  const result = await myFunctionThatUsesAxiosPost();

  // And finally we can write our assertions
  expect(result).toBe('mock data');
});