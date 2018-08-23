require 'validates_timeliness'

class Event < ActiveRecord::Base
	belongs_to :user
	validates :title, presence: true
	validates :event_type, presence: true
	validates :start, presence: true
	validates_datetime :end, :on_or_after => :start
	# retrive current location
	geocoded_by :location
	after_validation :geocode, :if => :location_changed?
	after_validation :event_type, :if => :event_type_changed?
	before_save :calc_notifdate

	def calc_notifdate
		if self.remind_in_advance.blank?
			if self.user.remind.days > 0
				self.notifdate = self.start - self.user.remind.days
			else 
				# dont send reminders.
				self.notifdate = DateTime.new(1970, 2, 2)
			end
		else
			if self.remind_in_advance.days > 0
				self.notifdate = self.start - self.remind_in_advance.days
			else
				# dont send reminders.
				self.notifdate = DateTime.new(1970, 2, 2)
			end 
		end

	end	

	def self.notif_reminder
    	@neednotifs = Event.where(:notifdate => Date.today.beginning_of_day..Date.today.end_of_day)
    	@users = []
   		@neednotifs.each do |ev|
      		@users << ev.user
    	end
    	@users.uniq.each do |us|
    		UserMailer.event_email(us, @neednotifs).deliver_now
  		end
  	end
end
