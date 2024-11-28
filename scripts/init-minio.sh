#!/bin/sh
/usr/bin/mc alias set myminio http://minio:9000 minioadmin minioadmin
/usr/bin/mc mb myminio/submissions --ignore-existing
/usr/bin/mc anonymous set public myminio/submissions 