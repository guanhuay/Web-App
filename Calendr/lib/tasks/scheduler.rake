desc "Heroku scheduler tasks"
task :email_notif => :environment do
  puts "Sending out email notifications."
  Event.notif_reminder
  puts "Emails sent!"
end