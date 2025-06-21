curl -X POST http://localhost:5000/api/streams/start -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc1MDQ4OTAzNywiZXhwIjoxNzUwNTc1NDM3fQ.b2zsctVbwHySBbqS5TUdmJNUqztJub6DpGiFmEToMfE" -H "Content-Type: application/json"






a@a:~/storef$ ffmpeg -i 6000210-uhd_2160_3840_24fps.mp4 -t 5 -c copy test_chunk_valid.mp4
ffmpeg version 4.4.2-0ubuntu0.22.04.1 Copyright (c) 2000-2021 the FFmpeg developers
  built with gcc 11 (Ubuntu 11.2.0-19ubuntu1)
  configuration: --prefix=/usr --extra-version=0ubuntu0.22.04.1 --toolchain=hardened --libdir=/usr/lib/x86_64-linux-gnu --incdir=/usr/include/x86_64-linux-gnu --arch=amd64 --enable-gpl --disable-stripping --enable-gnutls --enable-ladspa --enable-libaom --enable-libass --enable-libbluray --enable-libbs2b --enable-libcaca --enable-libcdio --enable-libcodec2 --enable-libdav1d --enable-libflite --enable-libfontconfig --enable-libfreetype --enable-libfribidi --enable-libgme --enable-libgsm --enable-libjack --enable-libmp3lame --enable-libmysofa --enable-libopenjpeg --enable-libopenmpt --enable-libopus --enable-libpulse --enable-librabbitmq --enable-librubberband --enable-libshine --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libsrt --enable-libssh --enable-libtheora --enable-libtwolame --enable-libvidstab --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx265 --enable-libxml2 --enable-libxvid --enable-libzimg --enable-libzmq --enable-libzvbi --enable-lv2 --enable-omx --enable-openal --enable-opencl --enable-opengl --enable-sdl2 --enable-pocketsphinx --enable-librsvg --enable-libmfx --enable-libdc1394 --enable-libdrm --enable-libiec61883 --enable-chromaprint --enable-frei0r --enable-libx264 --enable-shared
  libavutil      56. 70.100 / 56. 70.100
  libavcodec     58.134.100 / 58.134.100
  libavformat    58. 76.100 / 58. 76.100
  libavdevice    58. 13.100 / 58. 13.100
  libavfilter     7.110.100 /  7.110.100
  libswscale      5.  9.100 /  5.  9.100
  libswresample   3.  9.100 /  3.  9.100
  libpostproc    55.  9.100 / 55.  9.100
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '6000210-uhd_2160_3840_24fps.mp4':
  Metadata:
    major_brand     : mp42
    minor_version   : 0
    compatible_brands: mp42mp41isomavc1
    creation_time   : 2020-11-27T02:40:59.000000Z
  Duration: 00:00:10.03, start: 0.000000, bitrate: 13680 kb/s
  Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709), 2160x3840, 13444 kb/s, 23.98 fps, 23.98 tbr, 24k tbn, 48k tbc (default)
    Metadata:
      creation_time   : 2020-11-27T02:40:59.000000Z
      handler_name    : L-SMASH Video Handler
      vendor_id       : [0][0][0][0]
      encoder         : AVC Coding
  Stream #0:1(und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 253 kb/s (default)
    Metadata:
      creation_time   : 2020-11-27T02:40:59.000000Z
      handler_name    : L-SMASH Audio Handler
      vendor_id       : [0][0][0][0]
Output #0, mp4, to 'test_chunk_valid.mp4':
  Metadata:
    major_brand     : mp42
    minor_version   : 0
    compatible_brands: mp42mp41isomavc1
    encoder         : Lavf58.76.100
  Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709), 2160x3840, q=2-31, 13444 kb/s, 23.98 fps, 23.98 tbr, 24k tbn, 24k tbc (default)
    Metadata:
      creation_time   : 2020-11-27T02:40:59.000000Z
      handler_name    : L-SMASH Video Handler
      vendor_id       : [0][0][0][0]
      encoder         : AVC Coding
  Stream #0:1(und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 253 kb/s (default)
    Metadata:
      creation_time   : 2020-11-27T02:40:59.000000Z
      handler_name    : L-SMASH Audio Handler
      vendor_id       : [0][0][0][0]
Stream mapping:
  Stream #0:0 -> #0:0 (copy)
  Stream #0:1 -> #0:1 (copy)
Press [q] to stop, [?] for help
frame=  122 fps=0.0 q=-1.0 Lsize=    8995kB time=00:00:04.99 bitrate=14761.2kbits/s speed=57.8x    
video:8835kB audio:155kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 0.054682%
a@a:~/storef$ 



















a@a:~/storef$ curl http://localhost:5000/api/streams/685659660933d7cb88a7e397/live.m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:5.1720,
https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqkw6r4glzh37dn3dxj7nvlxm3tvzgww4vvskdi2izj2uhfa7hteei
a@a:~/storef$ 






a@a:~/storef$ ffmpeg -i 6000210-uhd_2160_3840_24fps.mp4 -ss 5 -t 5 -c copy test_chunk_valid_2.mp4
ffmpeg version 4.4.2-0ubuntu0.22.04.1 Copyright (c) 2000-2021 the FFmpeg developers
  built with gcc 11 (Ubuntu 11.2.0-19ubuntu1)
  configuration: --prefix=/usr --extra-version=0ubuntu0.22.04.1 --toolchain=hardened --libdir=/usr/lib/x86_64-linux-gnu --incdir=/usr/include/x86_64-linux-gnu --arch=amd64 --enable-gpl --disable-stripping --enable-gnutls --enable-ladspa --enable-libaom --enable-libass --enable-libbluray --enable-libbs2b --enable-libcaca --enable-libcdio --enable-libcodec2 --enable-libdav1d --enable-libflite --enable-libfontconfig --enable-libfreetype --enable-libfribidi --enable-libgme --enable-libgsm --enable-libjack --enable-libmp3lame --enable-libmysofa --enable-libopenjpeg --enable-libopenmpt --enable-libopus --enable-libpulse --enable-librabbitmq --enable-librubberband --enable-libshine --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libsrt --enable-libssh --enable-libtheora --enable-libtwolame --enable-libvidstab --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx265 --enable-libxml2 --enable-libxvid --enable-libzimg --enable-libzmq --enable-libzvbi --enable-lv2 --enable-omx --enable-openal --enable-opencl --enable-opengl --enable-sdl2 --enable-pocketsphinx --enable-librsvg --enable-libmfx --enable-libdc1394 --enable-libdrm --enable-libiec61883 --enable-chromaprint --enable-frei0r --enable-libx264 --enable-shared
  libavutil      56. 70.100 / 56. 70.100
  libavcodec     58.134.100 / 58.134.100
  libavformat    58. 76.100 / 58. 76.100
  libavdevice    58. 13.100 / 58. 13.100
  libavfilter     7.110.100 /  7.110.100
  libswscale      5.  9.100 /  5.  9.100
  libswresample   3.  9.100 /  3.  9.100
  libpostproc    55.  9.100 / 55.  9.100
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '6000210-uhd_2160_3840_24fps.mp4':
  Metadata:
    major_brand     : mp42
    minor_version   : 0
    compatible_brands: mp42mp41isomavc1
    creation_time   : 2020-11-27T02:40:59.000000Z
  Duration: 00:00:10.03, start: 0.000000, bitrate: 13680 kb/s
  Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709), 2160x3840, 13444 kb/s, 23.98 fps, 23.98 tbr, 24k tbn, 48k tbc (default)
    Metadata:
      creation_time   : 2020-11-27T02:40:59.000000Z
      handler_name    : L-SMASH Video Handler
      vendor_id       : [0][0][0][0]
      encoder         : AVC Coding
  Stream #0:1(und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 253 kb/s (default)
    Metadata:
      creation_time   : 2020-11-27T02:40:59.000000Z
      handler_name    : L-SMASH Audio Handler
      vendor_id       : [0][0][0][0]
Output #0, mp4, to 'test_chunk_valid_2.mp4':
  Metadata:
    major_brand     : mp42
    minor_version   : 0
    compatible_brands: mp42mp41isomavc1
    encoder         : Lavf58.76.100
  Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709), 2160x3840, q=2-31, 13444 kb/s, 23.98 fps, 23.98 tbr, 24k tbn, 24k tbc (default)
    Metadata:
      creation_time   : 2020-11-27T02:40:59.000000Z
      handler_name    : L-SMASH Video Handler
      vendor_id       : [0][0][0][0]
      encoder         : AVC Coding
  Stream #0:1(und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 253 kb/s (default)
    Metadata:
      creation_time   : 2020-11-27T02:40:59.000000Z
      handler_name    : L-SMASH Audio Handler
      vendor_id       : [0][0][0][0]
Stream mapping:
  Stream #0:0 -> #0:0 (copy)
  Stream #0:1 -> #0:1 (copy)
Press [q] to stop, [?] for help
frame=   96 fps=0.0 q=-1.0 Lsize=    6519kB time=00:00:04.98 bitrate=10715.1kbits/s speed=  71x    
video:6360kB audio:154kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 0.067816%
a@a:~/storef$ 









a@a:~/storef$ curl -X POST http://localhost:5000/api/streams/685659660933d7cb88a7e397/upload   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc1MDQ4OTAzNywiZXhwIjoxNzUwNTc1NDM3fQ.b2zsctVbwHySBbqS5TUdmJNUqztJub6DpGiFmEToMfE"   -F "sequence=1"   -F "video_chunk=@test_chunk_valid_2.mp4"
{"success":true,"message":"Chunk 1 uploaded successfully."}a@a:~/storef$ 










a@a:~/storef$ curl http://localhost:5000/api/streams/685659660933d7cb88a7e397/live.m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:5.1720,
https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqkw6r4glzh37dn3dxj7nvlxm3tvzgww4vvskdi2izj2uhfa7hteei
#EXTINF:5.0100,
https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqcysgg5ke74x3ol75fvdkivqwaouz44nqrreneofh6uuwgb5sq2ly
a@a:~/storef$ 

a@a:~/storef$ 



















a@a:~/storef$ curl -X POST http://localhost:5000/api/streams/685659660933d7cb88a7e397/stop \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY4OGMzNTNlNTQzZTAzMWYzYjAxOCIsImlhdCI6MTc1MDQ4OTAzNywiZXhwIjoxNzUwNTc1NDM3fQ.b2zsctVbwHySBbqS5TUdmJNUqztJub6DpGiFmEToMfE" \
  -H "Content-Type: application/json"
{"success":true,"message":"Stream finalized successfully. VOD created.","videoId":"68565c0f0933d7cb88a7e3a1","videoUrl":"https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqfvqh53yllfuu23dwidhrehk7nzzmx7f7hlkkdneaw2iefizkfmpi"}a@a:~/storef$ 





















When a user starts streaming:
Frontend automatically calls /api/streams/start to get a streamId
Sets up a WebRTC or Media Recorder to capture the user's camera/screen
During streaming:
Frontend automatically splits the stream into chunks (typically 5-10 seconds each)
Handles sequence numbering automatically
Uploads each chunk with the correct sequence number to /api/streams/:streamId/upload
The HLS manifest (live.m3u8) we just saw:
Gets automatically updated as new chunks arrive
Contains the duration of each chunk (#EXTINF:5.1720, and #EXTINF:5.0100,)
Lists the CDN URLs for each chunk in sequence
Players (like video.js or HLS.js) can use this to play the stream smoothly
When streaming ends:
Frontend would call the stop endpoint
Server would finalize the stream and create a permanent VOD (Video on Demand) version
