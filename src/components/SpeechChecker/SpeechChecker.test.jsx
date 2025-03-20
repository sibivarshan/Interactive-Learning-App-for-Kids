import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SpeechChecker from './SpeechChecker';

// Mock the SpeechRecognition API to avoid browser-related issues
window.SpeechRecognition = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  onresult: jest.fn(),
  onend: jest.fn(),
}));

describe('SpeechChecker Component', () => {
  test('renders the initial stage correctly', () => {
    render(<SpeechChecker />);
    
    expect(screen.getByText(/How to Practice Your Speaking Skills/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Speaking Practice/i })).toBeInTheDocument();
  });

  test('transitions to the topic selection stage on start', async () => {
    render(<SpeechChecker />);
    
    fireEvent.click(screen.getByRole('button', { name: /Start Speaking Practice/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Your Speaking Topic:/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start Recording/i })).toBeInTheDocument();
    });
  });

  test('transitions to recording stage when recording starts', async () => {
    render(<SpeechChecker />);
    
    fireEvent.click(screen.getByRole('button', { name: /Start Speaking Practice/i }));

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Start Recording/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Your Speech:/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Stop & Get Feedback/i })).toBeInTheDocument();
    });
  });
});
