import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { docClient } from '../config/dynamodb.js';
import { generateToken } from '../utils/jwt.js';

const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || 'CloudDriveUsers';

export const authService = {
  /**
   * Registers a new user in DynamoDB
   */
  signup: async (name, email, password) => {
    // 1. Check if user already exists
    const checkParams = {
      TableName: USERS_TABLE,
      IndexName: "EmailIndex",
      KeyConditionExpression: "Email = :email",
      ExpressionAttributeValues: {
        ":email": email.toLowerCase(),
      },
    };

    const existingUser = await docClient.send(
      new QueryCommand(checkParams)
    );
    if (existingUser.Items.length > 0) {
      const err = new Error('Email is already registered.');
      err.statusCode = 400;
      throw err;
    }

    // 2. Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user item
    const userId = uuidv4();
    const newUser = {
      Email: email.toLowerCase(),
      UserID: userId,
      Name: name,
      Password: hashedPassword,
      CreatedAt: new Date().toISOString(),
    };

    // 4. Store user in DynamoDB
    const putParams = {
      TableName: USERS_TABLE,
      Item: newUser,
    };

    await docClient.send(new PutCommand(putParams));

    // Return success without password field
    const { Password, ...userProfile } = newUser;
    return userProfile;
  },

  /**
   * Authenticates user, returning a JWT token
   */
  login: async (email, password) => {
    // 1. Fetch user by Email
const getParams = {
  TableName: USERS_TABLE,
  IndexName: "EmailIndex",
  KeyConditionExpression: "Email = :email",
  ExpressionAttributeValues: {
    ":email": email.toLowerCase(),
  },
};

const result = await docClient.send(
  new QueryCommand(getParams)
);

const user = result.Items[0];

    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    // 3. Generate JWT Token
    const payload = {
      userId: user.UserID,
      email: user.Email,
      name: user.Name,
    };
    const token = generateToken(payload);

    // Return token and profile summary
    return {
      token,
      user: {
        id: user.UserID,
        name: user.Name,
        email: user.Email,
        joinedDate: user.CreatedAt.split('T')[0],
      },
    };
  },

  /**
   * Retrieves profile details for the authenticated user
   */
  getProfile: async (email) => {
const getParams = {
  TableName: USERS_TABLE,
  IndexName: "EmailIndex",
  KeyConditionExpression: "Email = :email",
  ExpressionAttributeValues: {
    ":email": email.toLowerCase(),
  },
};

const result = await docClient.send(
  new QueryCommand(getParams)
);

const user = result.Items[0];

    if (!user) {
      const err = new Error('User profile not found.');
      err.statusCode = 404;
      throw err;
    }

    // Exclude password Hash from return
    const { Password, ...userProfile } = user;
    return userProfile;
  },
};

export default authService;
