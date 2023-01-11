#!/bin/bash

rsync -avz -e "ssh -p 22" -r --exclude="node_modules" -r --exclude=".next" . admin@45.85.146.163:/home/admin/app
