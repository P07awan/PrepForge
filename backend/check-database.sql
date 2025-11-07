-- Check all users
SELECT id, email, "firstName", "lastName", role, subscription, "createdAt" 
FROM "User";

-- Count records in each table
SELECT 'Users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'AI Interviews', COUNT(*) FROM "AIInterview"
UNION ALL
SELECT 'Live Interviews', COUNT(*) FROM "LiveInterview"
UNION ALL
SELECT 'Payments', COUNT(*) FROM "Payment"
UNION ALL
SELECT 'Questions', COUNT(*) FROM "Question"
UNION ALL
SELECT 'Responses', COUNT(*) FROM "Response"
UNION ALL
SELECT 'Achievements', COUNT(*) FROM "Achievement";

-- Check AI Interviews
SELECT id, "userId", "interviewType", topic, difficulty, status, "createdAt"
FROM "AIInterview"
LIMIT 10;

-- Check Live Interviews
SELECT id, "candidateId", "interviewerId", "interviewType", topic, status, "scheduledAt"
FROM "LiveInterview"
LIMIT 10;
