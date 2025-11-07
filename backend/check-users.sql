-- Quick check of users in database for testing
SELECT id, email, firstName, lastName, createdAt 
FROM User 
ORDER BY createdAt DESC 
LIMIT 10;
