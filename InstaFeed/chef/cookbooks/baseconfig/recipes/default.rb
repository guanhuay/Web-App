# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end
execute 'apt_update' do
  command 'apt-get update'
end

# Set up mysql
['mysql-server','mysql-common','mysql-client'].each do |p|
  package p do
    action :install
  end
end

execute 'setup_mysql' do
  command 'sudo bash /home/ubuntu/project/setup_mysql.sh'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
execute 'ntp_restart' do
  command 'service ntp restart'
end

# Install nginx via apt-get
package "nginx"
# Override the default nginx config with the one in our cookbook.
cookbook_file "nginx-default" do
  path "/etc/nginx/sites-available/default"
end
# Reload nginx to pick up new nginx config
service "nginx" do
  action :reload
end

# Add repository so apt-get can install latest Node from NodeSource
execute "add_nodesource_repo" do
    command "curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -"
end

# Install node.js
package "nodejs"

# Install package dependencies and run npm install
execute "npm_install" do
    cwd "/home/ubuntu/project/web-app"
    command "sudo npm install -g node-pre-gyp && npm install --no-bin-links"
end

# Populate the DB
execute "populate_db" do
    cwd "/home/ubuntu/project/web-app"
    command "node populateDb.js"
end

# Add a service file for running the app on startup
cookbook_file "instafeed.service" do
    path "/etc/systemd/system/instafeed.service"
end

# Start the app
execute "start_instafeed" do
    command "sudo systemctl start instafeed"
end

# Start app on VM startup
execute "startup_instafeed" do
    command "sudo systemctl enable instafeed"
end