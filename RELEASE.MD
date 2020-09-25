# Tractor release process
Must have permissions for https://github.com/TradeMe/tractor
Must have permissions for https://www.npmjs.com/org/tractor and https://www.npmjs.com/org/tractor-plugins
Must have npm two-factor authentication one time passwords set up. Make sure you have an authentication app set up on your phone. 

## Troubleshooting tips
You need to have a version of sass installed. We did this by installing ruby and then the sass gem.
You might need to separately pull the binary files in your git repo using git lfs pull. You can check if your binary files are correctly downloaded by going to the packages\ui\src\images\ folder and checking that the icons look correct.
If lerna is telling you that there is no new package to publish, you can use the --force-publish flag to publish the current packages anyway.
Ensure that when you are trying to publish, you are logged in as trademe-read. You can check this using 'npm whoami'. If you are logged in as your own user, find a friend who is logged in as trademe-read so you can get the password. 
If you are missing images in the Tractor UI, like the setting cogs, ensure that you have done a pull of the repo when you are publishing. These are base64 images. 

## How it works
Let’s say you’re on version 1.7.0 and you want to release version 1.8.0

Make sure you have a new branch for the changes, called something like prepare-1.8.0

Push the branch to Github, the https://travis-ci.org/TradeMe/tractor build should run. Make sure it’s passing the build.

IMPORTANT: Run the complete build locally with yarn build from the root of the project on your branch.

Use Lerna to publish. You probably want to release a “prerelease” version first from your branch, before merging to master. To do that, run: yarn publish:preminor, yarn publish:prepatch or yarn publish:premajor

You will be prompted for the current one time password from your authentication application.
You will probably need to confirm the version and packages you wish to release.

This will have released a version 1.8.0-alpha.0 under the @next tag

Test out your release version in FrEnd/Tangram/Whatever.

If you need to push a new version of the prerelease, you need to publish again, but you can just use prerelease: yarn publish:prerelease

This will have release a version 1.8.0-alpha.1 under the @next tag

Once they’re good, and you’re all happy with the changes, merge your branch into master.

IMPORTANT (AGAIN): Run the complete build locally with yarn build from the root of the project.

Use yarn select-version to select the version you want to publish.
Commit your changes (package.json changes).

Use yarn publish:release to publish the release version.
This will release a version 1.8.0

Now you can update your project to the released versions, and you should be good to go. 

Update the package.json file in your repo with the new version number. Ex below:
"@tractor-plugins/mocha-specs": "^1.7.8-alpha.2",
"@tractor-plugins/mock-requests": "^1.7.8-alpha.2",
"@tractor-plugins/page-objects": "^1.7.8-alpha.2",
"@tractor-plugins/screen-size": "^1.7.8-alpha.2",
"@tractor/cli": "^1.7.8-alpha.2",
"@tractor/core": "^1.7.8-alpha.2",

