# Repo_CSFLE

This repo is step by step guide to set up and Demo MongoDB Client Side Field Level Encryption with Customer Master Key in AWS KMS.

First step is to create an IAM User with Admin Previleges or Having previlges to access Customer Master Key. 

If you are creating a user with specific previledges Please refer to documentation : https://www.mongodb.com/docs/drivers/security/client-side-field-level-encryption-local-key-to-kms/


npm install mongodb

npm install mongodb-client-encryption

Create 
aws kms create-key --tags TagKey=owner, TagValue=<name> --description "Demo Key for FLE"

Copy the ARN to be used in future

  
Create Data Encryption Key
  Modify the fle_create_dataEncryption_KMS to replace the placeholders in <>
  
  node fle_create_dataEncryption_KMS
  
Create a New document with schema and encrypted fields.
  Modify the Client - Replace all the placeholders in <>
  
  node fle_client.js
  
Read a document with schema and decrypted fields (Access to Master Key)
  
  node fle_read_client.js
  
Read a document with encrypted fields (No Access to Master Key)
  
  node non_fle_read_client.js
  

  
  
