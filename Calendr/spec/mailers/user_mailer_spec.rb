require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
	describe 'welcome email' do

    fixtures :users

    before :each do
      @user = users(:steve)
      @mail = UserMailer.welcome_email(@user)
    end

    it 'renders the subject' do
      expect(@mail.subject).to eql('Welcome to Calendr')
    end

    it 'renders the receiver email' do
      expect(@mail.to).to eql([@user.email])
    end

    it 'renders the sender email' do
      expect(@mail.from).to eql(['calendrteam@gmail.com'])
    end

    it 'assigns username' do
      expect(@mail.body.encoded).to match(@user.username)
    end

    it 'assigns welcome_url' do
      expect(@mail.body.encoded)
        .to match("http://clndr.herokuapp")
    end
  end

  describe 'event reminder' do

    fixtures :users, :events

    before :each do
      @user = users(:steve)
      @events = @user.events.all
      @mail = UserMailer.event_email(@user, @events)
    end

    it 'renders the subject' do
      expect(@mail.subject).to eql('Event Notification from Calendr')
    end

    it 'renders the receiver email' do
      expect(@mail.to).to eql([@user.email])
    end

    it 'renders the sender email' do
      expect(@mail.from).to eql(['calendrteam@gmail.com'])
    end

    it 'assigns correct event' do
      @events.each do |ev|
        expect(@mail.body.encoded).to match(ev.title)
        expect(@mail.body.encoded).to match(ev.start.strftime("%B %d, %Y"))
      end
    end
  end
end