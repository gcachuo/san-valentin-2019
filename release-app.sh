#!/usr/bin/env bash
echo -n "Enter the filename for the app [ENTER]: "
read appname
if [ ! -f build/android/android.keystore ]; then
    keytool -genkey -v -keystore build/android/android.keystore -alias android-app-key -keyalg RSA -keysize 2048 -validity 10000
fi
cordova build android --release >/dev/null
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore build/android/android.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk android-app-key
rm platforms/android/app/build/outputs/apk/release/app-release.apk
zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/apk/release/app-release.apk
rm -f build/android/*.apk && cp platforms/android/app/build/outputs/apk/release/app-release.apk build/android/${appname}".apk"