require 'google_calendar'

class EventsController < ApplicationController
  before_action :set_event, only: [:show, :edit, :update, :destroy, :location]

  # GET /events
  def index
    @user = User.find(params[:user_id])
    @events = @user.events.all
    @event = @user.events.build

    respond_to do |format|
      format.html { render 'index' }
      format.json { render :json => @events}
    end
  end

  # GET /events/1
  def show
    respond_to do |format|
      format.js {}
    end
  end
  # GET /events/1/location
  def location
    respond_to do |format|
      format.js{}
    end
  end

  # GET /events/new
  def new
    @event = Event.new
  end

  # GET /events/1/edit
  def edit
    respond_to do |format|
      format.js{}
    end
  end

  # POST /events
  def create

    @event = Event.new(event_params)
    @event.user = current_user
    
    respond_to do |format|
      if @event.save
        unless @event.user.token.nil?
          set_calendar
          event = @calendar.create_event do |e|
            e.title = @event.title
            e.start_time = @event.start + 7.hours
            e.end_time = @event.end + 7.hours
            unless @event.location.nil? 
              e.location = @event.location 
            end
            unless @event.notes.nil?
              e.description = @event.notes
            end
            # no reminders from google calendar!
            e.reminders = {'useDefault' => false}
          end

          @event.update_attribute(:google_id, event.id)
        end

        format.js {}  
        format.json { render action: 'show', status: :created, location: @event }
      else
        format.js {}    
      end
    end
  end

  # PATCH/PUT /events/1
  def update
    respond_to do |format|
      if @event.update(event_params)
        unless @event.user.token.nil?
          set_calendar
          event = @calendar.find_or_create_event_by_id(@event.google_id) do |e|
            e.title = @event.title
            e.start_time = @event.start + 7.hours
            e.end_time = @event.end + 7.hours
            unless @event.location.nil? 
              e.location = @event.location 
            end
            unless @event.notes.nil?
              e.description = @event.notes
            end
            # no reminders from google calendar!
            e.reminders = {'useDefault' => false}
          end

          @event.update_attribute(:google_id, event.id)
        end

        format.js {}  
      else
        format.js {}
      end
    end
  end
  
  # DELETE /events/1
  def destroy
    unless @event.user.token.nil?
      set_calendar
      ev = @calendar.find_event_by_id(@event.google_id)
      @calendar.delete_event ev[0] unless ev.nil?
    end
    @event.destroy
    respond_to do |format|
      format.html { redirect_to events_url, notice: 'Event was successfully destroyed.' }
      format.js {}
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event
      @user = current_user
      @event = @user.events.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def event_params
      params.require(:event).permit(:title, :event_type, :start, :end, :notes, :remind_in_advance, :location)
    end

    # Do not call if @event.user.token.nil?
    def set_calendar
      @calendar = Google::Calendar.new(:client_id => '410131672654-f3oshtf7ec3q64e232ar3tcuf1r2aoos.apps.googleusercontent.com',
                                       :client_secret => 'vuVR8Iowc6C9-P30gdEBM0Kf',
                                       :calendar => 'primary',
                                       :redirect_url => "http://clndr.herokuapp.com/oauth2callback")
                                       #:redirect_url => "http://localhost:5000/oauth2callback")
      @calendar.login_with_refresh_token(@event.user.token)
    end
end