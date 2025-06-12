POST /api/video/process
Input: Video file
Process:
Compress to different resolutions
Generate thumbnail
Get video metadata
Output: Processed video files and metadata
GET /api/video/status/:videoId
Check processing status
Return progress and status
GET /api/video/metadata/:videoId
Get video metadata
Return: duration, size, resolutions, etc.
DELETE /api/video/:videoId
Delete processed video
Clean up temporary files














a@a:~/storef$ curl -X POST http://localhost:5000/api/videos/process -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8" -F "file=@6000210-uhd_2160_3840_24fps.mp4"
{"success":true,"videoId":"684ae18ceff4a747e340de7c","message":"Video processing started"}a@a:~/storef$ 






a@a:~/storef$ curl -X GET http://localhost:5000/api/videos/status/684ae5d6aca01af7ebd4bb6a -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8"
{"success":true,"status":"completed","metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1280x720","1920x1080"]}}a@a:~/storef$ 







a@a:~/storef$ curl -X GET http://localhost:5000/api/videos/metadata/684ae5d6aca01af7ebd4bb6a -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8"
{"success":true,"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1280x720","1920x1080"]},"files":{"original":"uploads/fc79a80d41f85c463f312360547a0d8a","thumbnail":"uploads/fc79a80d41f85c463f312360547a0d8a_thumb.jpg","processed":[{"resolution":"1280x720","path":"uploads/fc79a80d41f85c463f312360547a0d8a_720p.mp4","_id":"684ae639aca01af7ebd4bb71"},{"resolution":"1920x1080","path":"upload
a@a:~/storef$ 












a@a:~/storef$ curl -X POST http://localhost:5000/api/videos/process -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8" -F "file=@6000210-uhd_2160_3840_24fps.mp4"
{"success":true,"videoId":"684ae5d6aca01af7ebd4bb6a","message":"Video processing started"}a@a:~/storef$ 
