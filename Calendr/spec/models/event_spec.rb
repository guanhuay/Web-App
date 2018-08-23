require 'rails_helper'

RSpec.describe User do

  fixtures :users, :events

  before :each do
    @user = users(:steve)
    @events = @user.events.all
  end

  it 'calculates the correct notifdate' do
    @events.each do |ev|
      notifdate = ev.remind_in_advance.nil? ? ev.start - 1.days : ev.start - ev.remind_in_advance.days
      ev.calc_notifdate
      expect(ev.notifdate).to eql(notifdate)
    end
  end
end
