a@a:~/storef$ curl -X POST http://localhost:5000/api/files/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTU0Nzc1MSwiZXhwIjoxNzQ5NjM0MTUxfQ.RTEcpph0K6tgddotSjpL1RFnMQyWwxDfBBkHLxK7f6c" \
  -d '{
    "name": "6000210-uhd_2160_3840_24fps.mp4",
    "size": 6000210,
    "type": "video/mp4"
  }'
{"success":true,"message":"Upload initiated successfully","fileId":"6847fc0cd17911cf0c14a07c","uploadUrl":"/api/files/chunk/6847fc0cd17911cf0c14a07c","chunks":6,"chunkSize":1048576}a@a:~/storef$






a@a:~/storef$ curl -X POST http://localhost:5000/api/files/chunk/6847fc0cd17911cf0c14a07c \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTU0OTMzMSwiZXhwIjoxNzQ5NjM1NzMxfQ.yI07uohVVmc2WI8hZ9sZwxTfKGsDwad0IFGB0ufZ2Qk" \
  -F "chunk=@6000210-uhd_2160_3840_24fps.mp4" \
  -F "chunkIndex=0" \
  -F "hash=$(sha256sum 6000210-uhd_2160_3840_24fps.mp4 | cut -d' ' -f1)"
{"success":true,"message":"Chunk uploaded successfully","progress":16.666666666666664,"uploadedChunks":1,"totalChunks":6}a@a:~/storef$ 