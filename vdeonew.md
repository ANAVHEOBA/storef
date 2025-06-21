a@a:~/storef$ curl -X POST http://localhost:5000/api/videos/process -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc1MDQyMzkxMCwiZXhwIjoxNzUwNTEwMzEwfQ.R-PeDRwIJI-WKORkGaQbr5tvP0H1OagaTU6R9g4QLj4" -F "file=@6000210-uhd_2160_3840_24fps.mp4"
{"success":true,"videoId":"6855a0ce3fb1c2d0987d1f61","message":"Video processing started"}a@a:~/storef$ 








a@a:~/storef$ curl -X GET http://localhost:5000/api/videos/status/6855a0ce3fb1c2d0987d1f61 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc1MDQyMzkxMCwiZXhwIjoxNzUwNTEwMzEwfQ.R-PeDRwIJI-WKORkGaQbr5tvP0H1OagaTU6R9g4QLj4"
{"success":true,"status":"completed","metadata":{"duration":10.026667,"size":17146619,"resolutions":["1920x1080","1280x720","854x480"]}}a@a:~/storef$ 
