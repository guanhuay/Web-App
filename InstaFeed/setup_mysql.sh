#!/bin/bash
set -ex
sudo mysql -u root -e "CREATE SCHEMA instafeed"
sudo mysql -u root -e "use mysql; update user set authentication_string=password(''), plugin='mysql_native_password' where user='root';"
sudo service mysql restart