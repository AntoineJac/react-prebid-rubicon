#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git checkout -b deploy
  git add .
  npm run precommit 
}

upload_files() {
  git remote add origin https://$GITHUB_TOKEN@github.com/AntoineJac/react-prebid-rubicon.git > /dev/null 2>&1
  git push --quiet --set-upstream origin deploy 
}

setup_git
commit_website_files
