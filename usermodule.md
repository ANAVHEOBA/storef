a@a:~/storef$ curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"email": "wisdomabraham92@gmail.com", "password": "Test@123", "username": "wisdom"}'
{"success":true,"message":"New verification code sent. Please check your email.","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTQ1NDAxNiwiZXhwIjoxNzQ5NDU3NjE2fQ.dYkbqMxlKsYKjfsVJk_DD4eJJlGI0Z9YTwfBb24Pros","verificationCode":"838128"}a@a:~/storef$ 









a@a:~/storef$ curl -X POST http://localhost:5000/api/auth/verify-email -H "Content-Type: application/json" -d '{"email": "wisdomabraham92@gmail.com", "code": "838128"}'
{"success":true,"message":"Email verified successfully"}a@a:~/storef$ 






a@a:~/storef$ curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "wisdomabraham92@gmail.com", "password": "Test@123"}'
{"success":true,"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc1MDQyMzkxMCwiZXhwIjoxNzUwNTEwMzEwfQ.R-PeDRwIJI-WKORkGaQbr5tvP0H1OagaTU6R9g4QLj4","user":{"id":"684688c353e543e031f3b018","email":"wisdomabraham92@gmail.com","username":"wisdom","isVerified":true}}a@a:~/storef$ 



