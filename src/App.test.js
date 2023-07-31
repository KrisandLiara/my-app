import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import ChatLayout from './ChatLayout';

// This line tells Jest to replace axios with our mock function
jest.mock('axios');

test('sends message when send button is clicked', async () => {
  const message = 'test message';
  const responseMessage = 'response message';
  
  axios.post.mockResolvedValue({ data: { message: responseMessage } });

  render(
    <MemoryRouter>
      <ChatLayout />
    </MemoryRouter>
  );
  
  const input = screen.getByPlaceholderText('Type your message...');
  fireEvent.change(input, { target: { value: message } });

  const button = screen.getByText('Send');
  fireEvent.click(button);

  // This line checks that axios.post was called with the expected arguments
  expect(axios.post).toHaveBeenCalledWith('/api/v1/chat', { prompt: message });

  await screen.findByText(responseMessage);
});

test('mocks axios.post call', async () => {
  // Here we define what the mock function should return
  axios.post.mockResolvedValue({ data: 'mock data' });

  // Then we call our function that uses axios.post
  const result = await myFunctionThatUsesAxiosPost();

  // And finally we can write our assertions
  expect(result).toBe('mock data');
});
