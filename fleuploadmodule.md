a@a:~/storef$ curl -X POST http://localhost:5000/api/files/upload -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTU3NDY4MiwiZXhwIjoxNzQ5NjYxMDgyfQ.JV2c6uaaBtRK4OKPTypl5G95VXC3LTpt_ZcZqSSdSQo" -d '{"name": "8432041-uhd_2160_4096_25fps.mp4", "size": 100000000, "type": "video/mp4"}'
{"success":true,"message":"Upload initiated successfully","fileId":"684864a2fda48100e69f8176","uploadUrl":"/api/files/chunk/684864a2fda48100e69f8176","chunks":8,"chunkSize":12500000}a@a:~/storef$ 





a@a:~/storef$ curl -X POST http://localhost:5000/api/files/chunk/6847fc0cd17911cf0c14a07c \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTU0OTMzMSwiZXhwIjoxNzQ5NjM1NzMxfQ.yI07uohVVmc2WI8hZ9sZwxTfKGsDwad0IFGB0ufZ2Qk" \
  -F "chunk=@6000210-uhd_2160_3840_24fps.mp4" \
  -F "chunkIndex=0" \
  -F "hash=$(sha256sum 6000210-uhd_2160_3840_24fps.mp4 | cut -d' ' -f1)"
{"success":true,"message":"Chunk uploaded successfully","progress":16.666666666666664,"uploadedChunks":1,"totalChunks":6}a@a:~/storef$ 












a@a:~/storef$ curl -X POST http://localhost:5000/api/files/chunk/684864a2fda48100e69f8176 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTU3NDY4MiwiZXhwIjoxNzQ5NjYxMDgyfQ.JV2c6uaaBtRK4OKPTypl5G95VXC3LTpt_ZcZqSSdSQo" -F "chunk=@8432041-uhd_2160_4096_25fps.mp4" -F "chunkIndex=0" -F "hash=66e170317106458a17b84f0e69ab95d1c3d1901746f8d4b67b09af313e7a2cd8"
{"success":true,"message":"Chunk uploaded successfully","progress":25,"uploadedChunks":2,"totalChunks":8,"ipfsCid":"QmfNDX6cbMKDJheRv6oJz5AjmXgXVNjrt4P4uHaResfn7c","filecoinDealId":"bafybeigcruhsdningk2sh6lzaq6dg7hsrpit4ccpok6ftobsgk6pozr5iy"}a@a:~/storef$ 