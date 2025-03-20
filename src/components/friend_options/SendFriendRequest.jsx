import { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig';
import './SendFriendRequest.css';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

function SendFriendRequest() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [currentUserData, setCurrentUserData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  // Fetch current user data and their friends
  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      try {
        // Get current user's details
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUserData(userDoc.data());
        }

        // Get friends list
        setLoadingFriends(true);
        const friendsDocRef = doc(db, 'friends', auth.currentUser.uid);
        const friendsDoc = await getDoc(friendsDocRef);
        if (friendsDoc.exists()) {
          const friendIds = friendsDoc.data().friends || [];
          const friendsData = await Promise.all(
            friendIds.map(async (friendId) => {
              const userDoc = await getDoc(doc(db, 'users', friendId));
              return userDoc.exists() ? userDoc.data().username : 'Unknown User';
            })
          );
          setFriends(friendsData);
        } else {
          setFriends([]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchData();
  }, []);

  const handleSendRequest = async () => {
    if (!username) {
      setStatus('Please enter a username.');
      return;
    }

    try {
      if (!currentUserData) {
        setStatus('Error: User data not loaded. Please try again.');
        return;
      }

      // Find the receiver user
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatus('User not found.');
        return;
      }

      const receiverDoc = querySnapshot.docs[0];
      const receiverId = receiverDoc.id;

      if (receiverId === auth.currentUser.uid) {
        setStatus('You cannot send a request to yourself.');
        return;
      }

      // Check if already friends
      const friendsDocRef = doc(db, 'friends', auth.currentUser.uid);
      const friendsDoc = await getDoc(friendsDocRef);
      if (friendsDoc.exists()) {
        const friendsList = friendsDoc.data().friends || [];
        if (friendsList.includes(receiverId)) {
          setStatus('You are already friends with this user.');
          return;
        }
      }

      // Check if request already exists (sent or received)
      const friendRequestsRef = collection(db, 'friendRequests');
      const existingRequestQuery = query(
        friendRequestsRef, 
        where('senderId', 'in', [auth.currentUser.uid, receiverId]),
        where('receiverId', 'in', [auth.currentUser.uid, receiverId])
      );

      const existingRequests = await getDocs(existingRequestQuery);

      if (!existingRequests.empty) {
        setStatus('A friend request already exists between you two.');
        return;
      }

      // Create a new document in friendRequests collection
      await addDoc(friendRequestsRef, {
        senderId: auth.currentUser.uid,
        senderUsername: currentUserData.username,
        receiverId: receiverId,
        receiverUsername: receiverDoc.data().username,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setStatus('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      setStatus('Failed to send request.');
    }
  };

  return (
    <div className="request-container">
      <h3>Send Friend Request</h3>
      <input
        type="text"
        placeholder="Enter friend's username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSendRequest}>Send Request</button>
      {status && <p className="status">{status}</p>}

      <hr />

      <h3>Your Friends</h3>
      {loadingFriends ? <p>Loading friends...</p> : friends.length === 0 ? <p>No friends added yet.</p> : (
        <ul>
          {friends.map((friendUsername, index) => (
            <li key={index}>{friendUsername}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SendFriendRequest;
