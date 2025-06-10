#!/bin/bash

# Check if file path is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <file_path>"
    exit 1
fi

FILE_PATH="$1"
FILE_SIZE=$(stat -f%z "$FILE_PATH")
CHUNK_COUNT=8
CHUNK_SIZE=$((FILE_SIZE / CHUNK_COUNT))

# Get the file ID from the user
read -p "Enter the file ID: " FILE_ID

# Get the auth token
read -p "Enter the auth token: " AUTH_TOKEN

echo "Uploading $CHUNK_COUNT chunks of size $CHUNK_SIZE bytes..."

# Upload each chunk
for i in $(seq 0 $((CHUNK_COUNT-1))); do
    echo "Uploading chunk $i..."
    
    # Calculate chunk hash
    CHUNK_HASH=$(dd if="$FILE_PATH" bs=$CHUNK_SIZE skip=$i count=1 2>/dev/null | sha256sum | cut -d' ' -f1)
    
    # Upload chunk
    curl -X POST "http://localhost:5000/api/files/chunk/$FILE_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -F "chunk=@$FILE_PATH" \
        -F "chunkIndex=$i" \
        -F "hash=$CHUNK_HASH"
    
    echo -e "\n"
done

echo "All chunks uploaded!" 