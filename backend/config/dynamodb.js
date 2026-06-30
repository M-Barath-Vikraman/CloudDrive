import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { awsConfig } from './aws.js';

// Initialize the core DynamoDB client
const rawClient = new DynamoDBClient(awsConfig);

// Create the DynamoDB Document Client wrapper for Javascript-native object conversion
const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    convertEmptyValues: true,       // Handles empty strings properly
    removeUndefinedValues: true,    // Drops undefined fields before sending to AWS
    convertClassInstanceToMap: true // Converts custom class instances to standard NoSQL maps
  },
  unmarshallOptions: {
    wrapNumbers: false             // Returns standard Javascript numeric data types
  }
});

export { docClient };
export default docClient;
