const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const moment = require('moment-timezone')



const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());



// Routes
app.post('/register', async (req, res) => {
  console.log('Received request body:', req.body); // Log the request body
  // Add this line to check the structure of req.body
  const { stepOneData, stepTwoData, stepThreeData, stepFourData } = req.body;
  // Check if stepOneData exists
  if (!stepOneData) {
    return res.status(400).send('Step one data is missing');
  }
  // Check if passwords match
  if (stepOneData.password !== stepOneData.confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }
  // Check if user already exists
  const users = getUsers();
  const existingUser = users.find(user => user.stepOneData.email === stepOneData.email);
  if (existingUser) {
    return res.status(400).send({ statusCode: 400, message: 'User already exists' });
  }
  // Generate 8-digit UUID for user
  const userId = users.length + 1;

  // Save user data
  const newUser = {
    stepOneData,
    stepTwoData,
    stepThreeData,
    stepFourData,
    role: 'user',
    status: 'pending',
    id: userId
  };
  users.push(newUser);
  saveUsers(users);
  res.send({ statusCode: 200, message: 'Registration successful' });
});

let loginRequests = [];

// Load login requests from JSON file if it exists
const loginRequestsFile = 'loginRequests.json';
if (fs.existsSync(loginRequestsFile)) {
  loginRequests = JSON.parse(fs.readFileSync(loginRequestsFile, 'utf-8'));
}

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const users = getUsers();
//   const existingRequestIndex = loginRequests.findIndex(req => req.user.stepOneData.email === email);
//   if (existingRequestIndex !== -1) {
//     loginRequests[existingRequestIndex] = { user: users.find(u => u.stepOneData.email === email), approved: false };
//     fs.writeFileSync(loginRequestsFile, JSON.stringify(loginRequests));

//     res.status(200).json({ statusCode: 200, message: "Login request updated. Waiting for admin approval." });
//     return;
//   }

//   const user = users.find(user => user.stepOneData.email === email);
//   if (!user) {
//     return res.status(200).send({ statusCode: 400, message: 'User not found' });
//   }
//   const passwordMatch = password == user.stepOneData.password;
//   if (!passwordMatch) {
//     return res.status(200).send({ statusCode: 400, message: 'Incorrect password' });
//   }
//   if (user.status === 'pending') {
//     return res.status(200).send({ statusCode: 400, message: 'Pending registration' });
//   }
//   if (user.status === 'denied') {
//     return res.status(200).send({ statusCode: 400, message: 'Access denied' });
//   }
//   loginRequests.push({ user, approved: false });
//   fs.writeFileSync(loginRequestsFile, JSON.stringify(loginRequests));
//   res.status(200).json({ statusCode: 200, message: "Login request received. Waiting for admin approval." });
// });


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  // Check if user exists and password is correct
  const user = users.find(u => u.stepOneData.email === email && u.stepOneData.password === password);
  if (!user) {
    res.status(200).json({ statusCode: 404, message: "User not found or password incorrect" });
    return;
  }

  // If userType is admin, return user details directly
  if (user.role === 'admin') {
    console.log("admin")
    res.status(200).json({ statusCode: 200, message: "Admin login successful", result: user });
    return;
  }

  if (user.status === 'pending') {
    return res.status(200).send({ statusCode: 400, message: 'Pending registration' });
  }
  if (user.status === 'denied') {
    return res.status(200).send({ statusCode: 400, message: 'Access denied' });
  }

  // Check if login request already exists for the user
  const existingRequestIndex = loginRequests.findIndex(req => req.user.stepOneData.email === email);
  if (existingRequestIndex !== -1) {
    console.log("existingRequestIndex")

    // If a request exists, update the existing request
    loginRequests[existingRequestIndex] = { user, approved: false };

    // Save login requests to JSON file
    fs.writeFileSync(loginRequestsFile, JSON.stringify(loginRequests));

    res.status(200).json({ statusCode: 200, message: "Login request updated. Waiting for admin approval." });
    return;
  }

  // Add login request to the list
  loginRequests.push({ user, approved: false });

  // Save login requests to JSON file
  fs.writeFileSync(loginRequestsFile, JSON.stringify(loginRequests));

  res.status(200).json({ statusCode: 200, message: "Login request received. Waiting for admin approval." });
});

app.get('/approval-status/:email', (req, res) => {
  const email = req.params.email;

  // Find the login request by email
  const request = loginRequests.find(req => req.user.stepOneData.email === email);
  if (request) {
    if (request.approved) {
      res.status(200).json({ statusCode: 200, message: 'User approved', result: request.user });
    } else {
      res.status(200).json({ statusCode: 400, message: 'User not approved' });
    }
  } else {
    res.status(200).json({ statusCode: 400, message: `Login request for ${email} not found.` });
  }
});


app.post('/approveLogin', (req, res) => {
  const { email } = req.body;

  // Find the login request by email and mark it as approved
  const request = loginRequests.find(req => req.user.stepOneData.email === email);
  if (request) {
    request.approved = true;

    // Save login requests to JSON file
    fs.writeFileSync(loginRequestsFile, JSON.stringify(loginRequests));

    res.status(200).json({ statusCode: 200, message: `Login request for ${email} approved.` });
  } else {
    res.status(200).json({ statusCode: 400, message: `Login request for ${email} not found.` });
  }
});

app.get('/pending-logins', (req, res) => {
  const pendingRequests = loginRequests.filter(req => !req.approved);
  const pendingRequestsWithDetails = pendingRequests.map(req => ({
    user: req.user,
    approved: req.approved
  }));
  res.status(200).json({ statusCode: 200, message: "Pending logins fetched successfully", result: pendingRequestsWithDetails });
});

//Get Pending Registration Request
app.get('/pendingRegistrations', async (req, res) => {
  // Retrieve user data from database
  const users = getUsers();
  const pendingUsers = users.filter(user => user.status === 'pending');

  // Check if any pending users exist
  if (pendingUsers.length === 0) {
    return res.status(200).send({ statusCode: 404, message: 'Pending users not found' });
  }

  // Check if password matches

  res.send({ statusCode: 200, message: 'Users fetched successfully', result: pendingUsers });
});

//Get all users
// app.get('/getAllUsers', async (req, res) => {
//     const users = getUsers();
//     const pendingUsers = users.filter(user => user.status === 'success');
//                 if (pendingUsers.length === 0) {
//             return res.status(404).send({ statusCode: 404, message: 'Users not found' });
//         }
//     res.send({statusCode:200,message:'Users fetched successfully',result:pendingUsers});
// });

app.get('/getAllUsers/:userId', async (req, res) => {
  const requestingUserId = req.params.userId;
  const users = getUsers();
  const friendships = getFriendships();

  // Retrieve the requesting user's friends
  const userFriends = friendships[requestingUserId] || [];

  // Filter users to include only those who have status as 'success' and are not friends with the requesting user
  // const eligibleUsers = users.filter(user => user.status === 'success' && !userFriends.includes(user.stepOneData.email));

  const eligibleUsers = users.filter(user => user.status === 'success' && user.role != "admin" && !userFriends.includes(user.stepOneData.email) && user.stepOneData.email !== requestingUserId);


  if (eligibleUsers.length === 0) {
    return res.status(200).send({ statusCode: 404, message: 'No eligible users found' });
  }

  res.send({ statusCode: 200, message: 'Eligible users fetched successfully', result: eligibleUsers });
});



// Update user status
app.put('/users/:userId/status', async (req, res) => {
  const userId = req.params.userId;
  const newStatus = req.body.status;

  try {
    let existingData = [];
    try {
      const data = fs.readFileSync('users.json');
      existingData = JSON.parse(data);
    } catch (err) {
      // File doesn't exist or couldn't be read; an empty array will be used
    }
    // Update user status
    const userIndex = existingData.findIndex(user => user.stepOneData.email === userId);
    if (userIndex !== -1) {
      existingData[userIndex].status = newStatus;
      // Write the updated users data back to the JSON file
      fs.writeFileSync('users.json', JSON.stringify(existingData, null, 4));
      res.status(200).send({ statusCode: 200, message: 'User status updated successfully' });
    } else {
      return res.status(200).send({ statusCode: 404, message: 'User not found' });
    }
  } catch (error) {
    res.status(200).send({ statusCode: 500, message: 'Internal Server Error', error: error.message });
  }
});

app.post('/friend-request', (req, res) => {
  const { senderId, recipientId } = req.body;
  // Load existing friend requests from JSON file
  let friendRequests = [];
  try {
    const data = fs.readFileSync('friend-requests.json', 'utf8');
    friendRequests = JSON.parse(data);
  } catch (err) {
    console.error('Error reading file:', err);
  }

  const existingRequest = friendRequests.find(request => request.senderId === senderId && request.recipientId === recipientId);
  if (existingRequest) {
    return res.status(200).json({ statusCode: 400, message: 'Friend request already exists' });
  }
  // Add the new friend request
  friendRequests.push({ senderId, recipientId });

  // Save the updated friend requests to the JSON file

  fs.writeFile('friend-requests.json', JSON.stringify(friendRequests), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.status(200).send({ statusCode: 400, message: 'Internal Server Error' });
    } else {
      res.status(200).send({ statusCode: 200, message: 'Friend request sent successfully' });
    }
  });
});


app.get('/friend-requests/:recipientId', (req, res) => {
  const recipientId = req.params.recipientId;
  const users = getUsers();
  const friendRequests = getFriendRequests();

  // Filter friend requests for the specified recipient
  const recipientRequests = friendRequests.filter(request => request.recipientId === recipientId);
  // Map sender details to recipient requests
  const recipientRequestsWithSenders = recipientRequests.map(request => {
    const sender = users.find(user => user.stepOneData.email === request.senderId);
    return {
      firstName: sender.stepOneData.firstName,
      lastName: sender.stepOneData.lastName,
      gender: sender.stepTwoData.gender,
      companyName: sender.stepFourData.companyName,
      email: sender.stepOneData.email,
      mobileNumber: sender.stepOneData.mobileNumber,
      profile: sender.stepThreeData.profile
    };
  });

  res.json({ statusCode: 200, message: 'Friend requests fetched successfully', result: recipientRequestsWithSenders });
});


// Route to accept a friend request
app.post('/accept-friend-request', (req, res) => {
  const { senderId, recipientId } = req.body;
  const friendRequests = getFriendRequests();
  let friendships = getFriendships();

  // Find the friend request to accept
  const requestIndex = friendRequests.findIndex(request => {
    return request.senderId === senderId && request.recipientId === recipientId;
  });

  if (requestIndex !== -1) {
    // Remove the friend request from the list
    const acceptedRequest = friendRequests.splice(requestIndex, 1)[0];

    // Save the updated friend requests to the JSON file
    fs.writeFile('friend-requests.json', JSON.stringify(friendRequests), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        res.status(200).send({ statusCode: 500, message: 'Internal Server Error' });
        return;
      }

      // Update friendships for both users
      if (!friendships[senderId]) {
        friendships[senderId] = [];
      }
      if (!friendships[recipientId]) {
        friendships[recipientId] = [];
      }
      friendships[senderId].push(recipientId);
      friendships[recipientId].push(senderId);

      try {
        fs.writeFileSync('friendships.json', JSON.stringify(friendships));
        res.status(200).send({ statusCode: 200, message: 'Friend request accepted successfully' });
      } catch (err) {
        console.error('Error writing friendships file:', err);
        res.status(200).send({ statusCode: 200, message: 'Internal Server Error' });
      }
    });
  } else {
    res.status(200).send({ statusCode: 200, message: 'Friend request not found' });
  }
});

// Route to get all friends with their user details
app.get('/getFriends/:userId', (req, res) => {
  const userId = req.params.userId;
  const friendships = getFriendships();
  const users = getUsers();

  // Check if the user ID exists
  const sender = users.find(user => user.stepOneData.email === userId);
  if (!sender) {
    res.status(200).json({ statusCode: 200, message: 'User not found' });
    return;
  }
  // Get the list of friend IDs for the given user
  const friendIds = friendships[userId] || [];

  // Retrieve user details for each friend
  const friendsWithDetails = friendIds.map(friendId => {
    const friendDetails = users.find(user => user.stepOneData.email === friendId);
    return {
      id: friendId,
      firstName: friendDetails.stepOneData.firstName,
      lastName: friendDetails.stepOneData.lastName,
      gender: friendDetails.stepTwoData.gender,
      companyName: friendDetails.stepFourData.companyName,
      email: friendDetails.stepOneData.email,
      mobileNumber: friendDetails.stepOneData.mobileNumber,
      profile: friendDetails.stepThreeData.profile
    };
  });

  res.json({ statusCode: 200, message: 'Friends fetched successfully', result: friendsWithDetails });
});


// Route to edit user details
app.put('/editUser/:userId', (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;
  const users = getUsers();

  // Find the user to be updated
  const userIndex = users.findIndex(user => user.stepOneData.email === userId);

  if (userIndex !== -1) {
    // Update the user's details
    const userToUpdate = users[userIndex];
    userToUpdate.stepOneData.firstName = updatedUserData.firstName || userToUpdate.stepOneData.firstName;
    userToUpdate.stepOneData.lastName = updatedUserData.lastName || userToUpdate.stepOneData.lastName;
    userToUpdate.stepOneData.mobileNumber = updatedUserData.mobile || userToUpdate.stepOneData.mobileNumber;
    userToUpdate.stepTwoData.gender = updatedUserData.gender || userToUpdate.stepTwoData.gender;
    userToUpdate.stepFourData.companyName = updatedUserData.companyName || userToUpdate.stepFourData.companyName;
    userToUpdate.stepFourData.companyAddress = updatedUserData.companyAddress || userToUpdate.stepFourData.companyAddress;
    userToUpdate.stepThreeData.profile = updatedUserData.profile || userToUpdate.stepThreeData.profile;

    // Save the updated user data to the JSON file
    fs.writeFile('users.json', JSON.stringify(users), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        res.status(200).send({ statusCode: 500, message: 'Internal Server Error' });
      } else {
        res.status(200).send({ statusCode: 200, message: 'User details updated successfully' });
      }
    });
  } else {
    res.status(200).send({ statusCode: 400, message: 'User not found' });
  }
});


function getFriendRequests() {
  try {
    const data = fs.readFileSync('friend-requests.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading friend requests file:', err);
    return [];
  }
}

function getFriendships() {
  try {
    const data = fs.readFileSync('friendships.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading friend requests file:', err);
    return [];
  }
}


//Send Message
app.post('/send-message', (req, res) => {
  const { senderId, receiverId, message } = req.body;
  const createdDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');


  const newMessage = {
    senderId,
    receiverId,
    createdDate,
    message
  };

  // Append the new message to the JSON file
  fs.readFile('messages.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(200).send({ statusCode: 500, message: 'Internal Server Error' });
      return;
    }

    let messages = JSON.parse(data);
    messages.push(newMessage);

    fs.writeFile('messages.json', JSON.stringify(messages, null, 4), err => {
      if (err) {
        console.error(err);
        res.status(200).send({ statusCode: 500, message: 'Internal Server Error' });
        return;
      }
      res.status(201).send({ statusCode: 200, message: 'Message sent successfully' });
    });
  });
});

app.get('/get-messages', (req, res) => {
  const { userId1, userId2 } = req.query;

  fs.readFile('messages.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let messages = JSON.parse(data);
    const filteredMessages = messages.filter(message =>
      (message.senderId === userId1 && message.receiverId === userId2) ||
      (message.senderId === userId2 && message.receiverId === userId1)
    );

    res.json({ statusCode: 200, message: 'Messages fetched successfully', result: filteredMessages });
  });
});

app.get('/admin/conversations', (req, res) => {
  fs.readFile('messages.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const users = getUsers()

    let messages = JSON.parse(data);
    let conversations = {};

    // Group messages by sender and receiver
    messages.forEach(message => {
      const key1 = `${message.senderId}-${message.receiverId}`;
      const key2 = `${message.receiverId}-${message.senderId}`;

      if (!conversations[key1] && !conversations[key2]) {
        conversations[key1] = {
          senderId: message.senderId,
          receiverId: message.receiverId
        };
      }
    });
    const filteredConversations = Object.values(conversations).filter(conversation => conversation.senderId && conversation.receiverId);
    // Combine conversation details with user details
    const conversationsWithUsers = filteredConversations.map(conversation => {
      const senderDetails = users.find(user => user.stepOneData.email === conversation.senderId);
      const receiverDetails = users.find(user => user.stepOneData.email === conversation.receiverId);

      return {
        conversation,
        senderDetails: {
          firstName: senderDetails.stepOneData.firstName,
          lastName: senderDetails.stepOneData.lastName,
          profile: senderDetails.stepThreeData.profile,
          companyName: senderDetails.stepFourData.companyName
        },
        receiverDetails: {
          firstName: receiverDetails.stepOneData.firstName,
          lastName: receiverDetails.stepOneData.lastName,
          profile: receiverDetails.stepThreeData.profile,
          companyName: receiverDetails.stepFourData.companyName
        }
      };
    });

    res.json({ statusCode: 200, message: "Conversation fetched successfully", result: conversationsWithUsers });
  });
});


// Helper functions
function getUsers() {
  const filePath = path.join(__dirname, 'users.json');
  try {
    const usersData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(usersData) || [];
  } catch (error) {
    console.error('Error reading user data:', error);
    return [];
  }
}

function saveUsers(users) {
  const filePath = path.join(__dirname, 'users.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    console.log('User data saved successfully.');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
