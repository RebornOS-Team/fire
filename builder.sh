cd dist && bsdtar -cvf linux-unpacked.tar.gz linux-unpacked
mv linux-unpacked.tar.gz ..
cd .. && updpkgsums
