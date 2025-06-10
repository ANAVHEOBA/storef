Upload Flow:
POST /api/files/upload - Initiate upload
POST /api/files/chunk/:id - Upload chunk
POST /api/files/complete/:id - Complete upload

Status:
GET /api/files/upload/:id/status - Get upload progress
GET /api/files/:id/storage-status - Get storage status