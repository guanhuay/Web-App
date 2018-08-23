#!/bin/bash
set -ex
cd server && npm install && node populateDb.js && npm start
