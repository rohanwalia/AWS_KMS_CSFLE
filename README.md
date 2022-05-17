# Repo_CSFLE

npm install mongodb-client-encryption

npm install mongodb

Create 
aws kms create-key --tags TagKey=owner, TagValue=<name> --description "Demo Key for FLE"

Copy the ARN to be used in future

  
Create Data Encryption Key
  Modify the fle_create_dataEncryption_KMS to replace the placeholders in <>
  
  node fle_create_dataEncryption_KMS
  
Modify the Client - Replace all the placeholders in <>
  
  node fle_client.js
  

  
  
