a@a:~/storef$ npm run test

> storef@1.0.0 test
> NODE_OPTIONS='--loader ts-node/esm' node src/scripts/test-synapse-upload.ts

(node:17135) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-node/esm", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:17135) [DEP0180] DeprecationWarning: fs.Stats constructor is deprecated.
(Use `node --trace-deprecation ...` to show where the warning was created)
Starting upload test...
Synapse initialized
Current USDFC balance: 10.0
Approving Pandora service at 0xf49ba5eaCdFD5EE3744efEdf413791935FE4D4c5...
Service approval transaction: 0x1ff1df77cadde390ea232673ae3501893e74c9720d59c232338a71f1c33756dc
Service approval confirmed.
Waiting for 30 seconds for network to sync...
Continuing...
New approval status: {
  isApproved: true,
  rateAllowance: 100000000000000000000n,
  lockupAllowance: 10000000000000000000000n,
  rateUsed: 0n,
  lockupUsed: 0n
}
File read: /home/a/storef/8432041-uhd_2160_4096_25fps.mp4
File size: 18516161 bytes
Creating storage and uploading file...
Selected provider: 0xe9bc394383B67aBcEbe86FD9843F53d8B4a2E981
Using proof set: 306
Upload successful!
Piece CID (commp): baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba
CDN URL: https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba
Verifying download...




Download verification successful!

Test Results: {
  success: true,
  commp: 'baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba',
  cdnUrl: 'https://0xC11af1a53f16c1863d0BB06857c87Ae433445C49.calibration.filcdn.io/baga6ea4seaqifra6g7i35zef35ufug6p6pohhkoltfakmymhs4zeztr6x4voqba',
  fileSize: 18516161
}
a@a:~/storef$ 
a@a:~/storef$ 
a@a:~/storef$ 
a@a:~/storef$ 
a@a:~/storef$ 