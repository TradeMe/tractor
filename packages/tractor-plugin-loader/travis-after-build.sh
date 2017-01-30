#!/bin/bash

if [[ $TRAVIS_PULL_REQUEST_BRANCH != *"greenkeeper"* ]]; then
    echo "This is not a greenkeeper PR, nothing to do 😎"
    exit 0
fi

echo "Cloning repo... 💿"
git clone "https://"$PUSH_TOKEN"@github.com/"$TRAVIS_REPO_SLUG".git" repo
echo "Done 👍"
cd repo

echo "Switching to branch $TRAVIS_PULL_REQUEST_BRANCH... 🌴"
git checkout $TRAVIS_PULL_REQUEST_BRANCH
echo "Done 👍"

# See if commit message includes "update"
git log --name-status HEAD^..HEAD | grep "update" || exit 0

echo "Updating lockfile... 🔒"
yarn --ignore-scripts
echo "Done 👍"

echo "Committing and pushing yarn.lock... 🖐"
git config --global user.email "no@no.com"
git config --global user.name "Travis CI"
git config --global push.default simple

git add yarn.lock
git commit -m "(dependencies ￼￼📦) - update yarn.lock"
git push
echo "Done 👍"
