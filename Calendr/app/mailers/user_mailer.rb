class UserMailer < ApplicationMailer
  default from: 'calendrteam@gmail.com'

  def welcome_email(user)
    @user = user
    @url  = 'http://clndr.herokuapp.com'
    mail(to: @user.email, subject: 'Welcome to Calendr')
  end


  def event_email(user, events)
  	@events = events.where(:user => user)
    mail(to: user.email, subject: 'Event Notification from Calendr')
  end


end
