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
{"success":true,"videoId":"684b2e12d41427f0518ef98b","message":"Video processing started"}a@a:~/storef








a@a:~/storef$ curl -X GET http://localhost:5000/api/videos/status/684b2e12d41427f0518ef98b -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8"
{"success":true,"status":"completed","metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1280x720","1920x1080"]}}a@a:~/storef$ 








a@a:~/storef$ curl -X GET http://localhost:5000/api/videos/metadata/684b2e12d41427f0518ef98b -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8"
{"success":true,"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1280x720","1920x1080"]},"files":{"original":{"path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni","commp":"baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni"},"thumbnail":{"path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c_thumb.jpg"},"processed":[{"resolution":"1280x720","path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c_720p.mp4","_id":"684b2e80d41427f0518ef991"},{"resolution":"1920x1080","path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c_1080p.mp4","_id":"684b2e80d41427f0518ef992"}]}}a@a:~/storef$ 












a@a:~/storef$ curl -X POST http://localhost:5000/api/videos/process -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8" -F "file=@6000210-uhd_2160_3840_24fps.mp4"
{"success":true,"videoId":"684ae5d6aca01af7ebd4bb6a","message":"Video processing started"}a@a:~/storef$ 





curl -X GET "http://localhost:5000/api/videos/YOUR_VIDEO_ID/quality?quality=1280x720" -H "Authorization: Bearer YOUR_TOKEN"