#!/bin/bash
# Make sure this file has executable permissions, run `chmod +x railway/run-worker.sh`

# This command runs the queue worker.
# An alternative is to use the php artisan queue:listen command
php artisan queue:work --tries=2 &
php artisan serve --host=0.0.0.0 --port ${PORT}
