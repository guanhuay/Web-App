require 'google_calendar'

class UsersController < ApplicationController
  before_action :set_user_id, :set_calendar

  def authorize
    url = @calendar.authorize_url
    redirect_to url.to_s, status: 303
  end

  def redirect

    if params[:code]
      refresh_token = @calendar.login_with_auth_code(params[:code])
      @user.update_attribute(:token, @calendar.refresh_token)
    end

    redirect_to root_path
  end

  def home

    # if authorized, refresh calendar
    unless @user.token.nil?
      begin
        sync_gcal
      rescue Google::HTTPAuthorizationFailed => e
        @user.update_attribute(:token, nil)
      end
    end


    @events = @user.events.all
    @event = @events.build

    respond_to do |format|
      format.html { render 'home' }
    end
  end

  private

    def sync_gcal
      
      @calendar.login_with_refresh_token(@user.token)
      result = @calendar.find_future_events

      unless result.empty?
        result.each do |event|
          # compensate for weird time differences when importing events
          # from google calendar
          start_time = Time.parse(event.start_time) - 7.hours
          end_time = Time.parse(event.end_time) - 7.hours

          duplicates = @user.events.where title: event.title, start: start_time, end: end_time
          if duplicates.empty?
            @user.events.create(title: event.title, start: start_time, end: end_time, location: event.location, notes: event.description, event_type: 'None', google_id: event.id)
          end          
        end
      end
    end

    def set_user_id
      @user = current_user
      @user_id = @user.id
    end

    def set_calendar
      @calendar = Google::Calendar.new(:client_id => '410131672654-f3oshtf7ec3q64e232ar3tcuf1r2aoos.apps.googleusercontent.com',
                                       :client_secret => 'vuVR8Iowc6C9-P30gdEBM0Kf',
                                       :calendar => 'primary',
                                       :redirect_url => 'http://clndr.herokuapp.com/oauth2callback')
                                       #:redirect_url => "http://localhost:5000/oauth2callback")
    end
end

