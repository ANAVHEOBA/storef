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