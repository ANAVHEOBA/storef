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












a@a:~/storef$ curl -X POST http://localhost:5000/api/videos/process \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8" \
-F "file=@6000210-uhd_2160_3840_24fps.mp4" \
-F "title=UHD Sample Video" \
-F "description=High quality 4K UHD sample video for testing" \
-F "tags=4k,uhd,sample" \
-F "visibility=public"
{"success":true,"videoId":"684b39df675cd76ad7c7d5b0","message":"Video processing started"}a@a:~/storef$ 








a@a:~/storef$ curl -X GET http://localhost:5000/api/videos/status/684b2e12d41427f0518ef98b -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8"
{"success":true,"status":"completed","metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1280x720","1920x1080"]}}a@a:~/storef$ 








a@a:~/storef$ curl -X GET http://localhost:5000/api/videos/metadata/684b2e12d41427f0518ef98b -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8"
{"success":true,"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1280x720","1920x1080"]},"files":{"original":{"path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni","commp":"baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni"},"thumbnail":{"path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c_thumb.jpg"},"processed":[{"resolution":"1280x720","path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c_720p.mp4","_id":"684b2e80d41427f0518ef991"},{"resolution":"1920x1080","path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c_1080p.mp4","_id":"684b2e80d41427f0518ef992"}]}}a@a:~/storef$ 












a@a:~/storef$ curl -X POST http://localhost:5000/api/videos/process -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTczNTc1MSwiZXhwIjoxNzQ5ODIyMTUxfQ.VLPEUsIlwZkbX5-VzsM_RFybTYMMh1UwLcQ70mAlVa8" -F "file=@6000210-uhd_2160_3840_24fps.mp4"
{"success":true,"videoId":"684ae5d6aca01af7ebd4bb6a","message":"Video processing started"}a@a:~/storef$ 





curl -X GET "http://localhost:5000/api/videos/YOUR_VIDEO_ID/quality?quality=1280x720" -H "Authorization: Bearer YOUR_TOKEN"













curl http://localhost:5000/api/videos/VIDEO_ID
           


           {
    "success": true,
    "video": {
        "id": "VIDEO_ID",
        "title": "UHD Sample Video",
        "description": "High quality 4K UHD sample video for testing",
        "creator": "USER_ID",
        "views": 1,
        "duration": 10.026667,
        "createdAt": "2024-03-12T...",
        "tags": ["4k", "uhd", "sample"],
        "sources": {
            "original": "https://0xC11...445C49.calibration.filcdn.io/baga6...rcni",
            "thumbnail": "uploads/f2a86e24...thumb.jpg",
            "qualities": [
                {
                    "resolution": "1920x1080",
                    "url": "/api/videos/VIDEO_ID/quality?quality=1920x1080"
                },
                {
                    "resolution": "1280x720",
                    "url": "/api/videos/VIDEO_ID/quality?quality=1280x720"
                },
                {
                    "resolution": "854x480",
                    "url": "/api/videos/VIDEO_ID/quality?quality=854x480"
                }
            ]
        }
    }
}













a@a:~/storef$ curl -X GET http://localhost:5000/api/videos/gallery
{"success":true,"videos":[{"id":"684b3a43534c5eecbc5cf47e","title":"UHD Sample Video","creator":"684688c353e543e031f3b018","views":0,"duration":10.026667,"thumbnail":"uploads/f7b939c258f33e4bb508e60ed895046a_thumb.jpg","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni","createdAt":"2025-06-12T20:36:19.450Z"}],"pagination":{"current":1,"total":1,"hasMore":false}}a@a:~/storef$ 










a@a:~/storef$ curl -X DELETE http://localhost:5000/api/videos/684b3a29534c5eecbc5cf47c \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTg0MjcwMCwiZXhwIjoxNzQ5OTI5MTAwfQ.fSKEUqeFWyTO5-op3VjP3QwJ0MVp6LBUjDUyzX0Wf-g"
{"success":true,"message":"Video deleted successfully"}a@a:~/storef$ 























a@a:~/storef$ curl -X GET http://localhost:5000/api/videos/my-videos -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc0OTg5OTYwNiwiZXhwIjoxNzQ5OTg2MDA2fQ.qTdZXIo5Eg964toDjoJxV-zzHNSddL-HEC5ae-Rx2AY"
{"success":true,"videos":[{"metadata":{"duration":19.285,"size":18516161,"resolutions":["1920x1080","1280x720","854x480"]},"files":{"original":{"path":"uploads/c253f75c2f495764138185ca8e1926dd","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba","commp":"baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba"},"thumbnail":{"path":"uploads/c253f75c2f495764138185ca8e1926dd_thumb.jpg"},"processed":[]},"_id":"684d4d23ec0be2d431d9e5fb","userId":"684688c353e543e031f3b018","title":"aaa","description":"aaaaaaa","originalName":"8432041-uhd_2160_4096_25fps.mp4","status":"completed","visibility":"public","tags":["aaaa"],"viewCount":0,"createdAt":"2025-06-14T10:21:23.791Z","updatedAt":"2025-06-14T10:22:10.806Z","__v":1},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["1920x1080","1280x720","854x480"]},"files":{"original":{"path":"uploads/78d10d7186942500446bd837f1f2089f","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni","commp":"baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni"},"thumbnail":{"path":"uploads/78d10d7186942500446bd837f1f2089f_thumb.jpg"},"processed":[]},"_id":"684d4220ec0be2d431d9e5b6","userId":"684688c353e543e031f3b018","title":"UHD Sample Video","description":"High quality 4K UHD sample video for testing","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"completed","visibility":"public","tags":["4k","uhd","sample"],"viewCount":0,"createdAt":"2025-06-14T09:34:24.711Z","updatedAt":"2025-06-14T09:35:05.444Z","__v":1},{"metadata":{"duration":19.285,"size":18516161,"resolutions":["1920x1080","1280x720","854x480"]},"files":{"original":{"path":"uploads/bc13d31b63fbbca6415770ae4b6cfa86","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba","commp":"baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba"},"thumbnail":{"path":"uploads/bc13d31b63fbbca6415770ae4b6cfa86_thumb.jpg"},"processed":[]},"_id":"684d4053ec0be2d431d9e5a6","userId":"684688c353e543e031f3b018","title":"aaaaaaaaaaaaa","description":"aaaaaaa","originalName":"8432041-uhd_2160_4096_25fps.mp4","status":"completed","visibility":"public","tags":["aaaaaaaa"],"viewCount":0,"createdAt":"2025-06-14T09:26:43.900Z","updatedAt":"2025-06-14T09:27:23.414Z","__v":1},{"metadata":{"duration":19.285,"size":18516161,"resolutions":["1920x1080","1280x720","854x480"]},"files":{"original":{"path":"uploads/25a4195d4a9e89e013fe3f261f73b371","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba","commp":"baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba"},"thumbnail":{"path":"uploads/25a4195d4a9e89e013fe3f261f73b371_thumb.jpg"},"processed":[]},"_id":"684d3d91ec0be2d431d9e594","userId":"684688c353e543e031f3b018","title":"abraham","description":"aaaaa","originalName":"8432041-uhd_2160_4096_25fps.mp4","status":"completed","visibility":"public","tags":["aaaa"],"viewCount":0,"createdAt":"2025-06-14T09:14:57.663Z","updatedAt":"2025-06-14T09:15:36.870Z","__v":1},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["1920x1080","1280x720","854x480"]},"files":{"original":{"path":"uploads/3e34d898cef3a101093b0019f68adeff","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni","commp":"baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni"},"thumbnail":{"path":"uploads/3e34d898cef3a101093b0019f68adeff_thumb.jpg"},"processed":[]},"_id":"684b3a67534c5eecbc5cf485","userId":"684688c353e543e031f3b018","title":"Untitled Video","description":"","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"completed","visibility":"private","tags":[],"viewCount":0,"createdAt":"2025-06-12T20:36:55.250Z","updatedAt":"2025-06-12T20:37:51.724Z","__v":1},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["1920x1080","1280x720","854x480"]},"files":{"original":{"path":"uploads/f7b939c258f33e4bb508e60ed895046a","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni","commp":"baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni"},"thumbnail":{"path":"uploads/f7b939c258f33e4bb508e60ed895046a_thumb.jpg"},"processed":[]},"_id":"684b3a43534c5eecbc5cf47e","userId":"684688c353e543e031f3b018","title":"UHD Sample Video","description":"High quality 4K UHD sample video for testing","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"completed","visibility":"public","tags":["4k","uhd","sample"],"viewCount":0,"createdAt":"2025-06-12T20:36:19.450Z","updatedAt":"2025-06-12T20:37:12.315Z","__v":1},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840"]},"files":{"original":{"path":"uploads/fb820492200e7c91a160fe975a733d86"},"processed":[]},"_id":"684b39df675cd76ad7c7d5b0","userId":"684688c353e543e031f3b018","title":"Untitled Video","description":"","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"processing","visibility":"private","tags":[],"viewCount":0,"createdAt":"2025-06-12T20:34:39.338Z","updatedAt":"2025-06-12T20:34:40.953Z","__v":0},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1280x720","1920x1080"]},"files":{"original":{"path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni","commp":"baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni"},"thumbnail":{"path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c_thumb.jpg"},"processed":[{"resolution":"1280x720","path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c_720p.mp4","_id":"684b2e80d41427f0518ef991"},{"resolution":"1920x1080","path":"uploads/f2a86e24a1a3019e0f1bb08a9b69014c_1080p.mp4","_id":"684b2e80d41427f0518ef992"}]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684b2e12d41427f0518ef98b","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"completed","createdAt":"2025-06-12T19:44:18.642Z","updatedAt":"2025-06-12T19:46:08.196Z","__v":1},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840"]},"files":{"original":{"path":"uploads/b5d0355d41fd21eda348e6726a7d7ed1","cdnUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni","commp":"baga6ea4seaqcjh3lbefhnncpvinpkshcm3npq5zjohteks7ief3ydkikay7rcni"},"processed":[]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684b1c310a04f392189a0a18","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"failed","createdAt":"2025-06-12T18:28:01.870Z","updatedAt":"2025-06-12T18:30:21.820Z","__v":0},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840"]},"files":{"original":{"path":"uploads/df39d7a47b243baa9f78448a2b8b15a5"},"processed":[]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684b1938d5ce69bff4748b1d","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"failed","createdAt":"2025-06-12T18:15:20.755Z","updatedAt":"2025-06-12T18:17:32.287Z","__v":0},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840"]},"files":{"original":{"path":"uploads/e7c385b6dfbbeabe276f5be98ba57fe3"},"processed":[]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684b16d70027daf2613220dd","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"failed","createdAt":"2025-06-12T18:05:11.893Z","updatedAt":"2025-06-12T18:07:03.200Z","__v":0},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840"]},"files":{"original":{"path":"uploads/f0b1a3ce1ca60cb94ea6e9394fe6bf99"},"processed":[]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684b15910c697e8d07891c5d","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"failed","createdAt":"2025-06-12T17:59:45.023Z","updatedAt":"2025-06-12T18:01:49.597Z","__v":0},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840"]},"files":{"original":{"path":"uploads/9d16ee69b1c84cdcd9b133ae72bee158"},"processed":[]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684b14092b522f523892ce69","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"failed","createdAt":"2025-06-12T17:53:13.624Z","updatedAt":"2025-06-12T17:56:08.704Z","__v":0},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1280x720","1920x1080"]},"files":{"original":"uploads/fc79a80d41f85c463f312360547a0d8a","thumbnail":"uploads/fc79a80d41f85c463f312360547a0d8a_thumb.jpg","processed":[{"resolution":"1280x720","path":"uploads/fc79a80d41f85c463f312360547a0d8a_720p.mp4","_id":"684ae639aca01af7ebd4bb71"},{"resolution":"1920x1080","path":"uploads/fc79a80d41f85c463f312360547a0d8a_1080p.mp4","_id":"684ae639aca01af7ebd4bb72"}]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684ae5d6aca01af7ebd4bb6a","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"completed","createdAt":"2025-06-12T14:36:06.620Z","updatedAt":"2025-06-12T14:37:45.992Z","__v":1},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1920x1080","1280x720"]},"files":{"original":"uploads/c01a52ce66283bb7e288c31e54af3355","thumbnail":"","processed":[{"resolution":"1280x720","path":"uploads/c01a52ce66283bb7e288c31e54af3355_720p.mp4","_id":"684ae1e6eff4a747e340de80"},{"resolution":"1920x1080","path":"uploads/c01a52ce66283bb7e288c31e54af3355_1080p.mp4","_id":"684ae1e6eff4a747e340de81"}]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684ae18ceff4a747e340de7c","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"completed","createdAt":"2025-06-12T14:17:48.680Z","updatedAt":"2025-06-12T14:19:18.136Z","__v":0},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840","1920x1080","1280x720"]},"files":{"original":"uploads/0efed8a97c046faabc272e5bbd3c5144","thumbnail":"","processed":[{"resolution":"1280x720","path":"uploads/0efed8a97c046faabc272e5bbd3c5144_720p.mp4","_id":"684ae13f274d32514f86d278"},{"resolution":"1920x1080","path":"uploads/0efed8a97c046faabc272e5bbd3c5144_1080p.mp4","_id":"684ae13f274d32514f86d279"}]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684ae0e3274d32514f86d271","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"completed","createdAt":"2025-06-12T14:14:59.709Z","updatedAt":"2025-06-12T14:16:31.009Z","__v":0},{"metadata":{"duration":10.026667,"size":17146619,"resolutions":["2160x3840"]},"files":{"processed":[]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684ae03ae2ab9dce10a1e4a6","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"completed","createdAt":"2025-06-12T14:12:10.701Z","updatedAt":"2025-06-12T14:12:11.575Z","__v":0},{"metadata":{"duration":0,"size":0,"resolutions":[]},"files":{"processed":[]},"title":"Untitled Video","description":"","visibility":"private","tags":[],"viewCount":0,"_id":"684ada74d6093135edc97bc3","userId":"684688c353e543e031f3b018","originalName":"6000210-uhd_2160_3840_24fps.mp4","status":"completed","createdAt":"2025-06-12T13:47:32.947Z","updatedAt":"2025-06-12T13:47:33.375Z","__v":0}]}a@a:~/storef$ 