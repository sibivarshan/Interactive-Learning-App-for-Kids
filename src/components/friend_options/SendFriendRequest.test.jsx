import { render, screen, fireEvent } from '@testing-library/react';
import SendFriendRequest from '../../components/friend_options/SendFriendRequest';
import { db, auth } from '../../firebaseConfig';
import { getDoc, getDocs, query, where, addDoc, collection, doc } from 'firebase/firestore';

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  
  afterAll(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
  });
  

jest.mock('../../firebaseConfig', () => ({
  auth: { currentUser: { uid: 'currentUserId' } },
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn()
}));

describe('SendFriendRequest Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and button', () => {
    render(<SendFriendRequest />);
    expect(screen.getByPlaceholderText("Enter friend's username")).toBeInTheDocument();
    expect(screen.getByText('Send Request')).toBeInTheDocument();
  });

  test('displays error when no username is entered', async () => {
    render(<SendFriendRequest />);
    fireEvent.click(screen.getByText('Send Request'));
    expect(await screen.findByText('Please enter a username.')).toBeInTheDocument();
  });
});
