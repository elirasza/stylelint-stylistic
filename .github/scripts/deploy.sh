#!/bin/bash

echo $NPM_REGISTRY:_authToken=$NPM_TOKEN >> .npmrc
npm version $GIT_TAG_NAME --no-git-tag-version
npm publish --registry https:$NPM_REGISTRY --access public