a@a:~/storef$ curl -X POST http://localhost:5000/api/files/upload   -H "Content-Type: application/json"   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTQ1NDQzMywiZXhwIjoxNzQ5NTQwODMzfQ.wmCOfR7Go0nFbovcAg0yvL6KRJYSwpUQf-bdCS5FGzY"   -d '{
    "name": "6000210-uhd_2160_3840_24fps.mp4",
    "size": 6000210,
    "type": "video/mp4"
  }'
{"success":true,"message":"Upload initiated successfully","fileId":"6847c160ed97124201ddb269","uploadUrl":"/api/files/chunk/6847c160ed97124201ddb269","chunks":6,"chunkSize":1048576}a@a:~/storef$ 



