class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_many :events

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :lockable, :confirmable


  after_save :send_welcome_email, :if => proc { |l| l.confirmed_at_changed? && l.confirmed_at_was.nil? }
  def send_welcome_email
    UserMailer.welcome_email(self).deliver
  end


  #default to send emails 5 days in advance for mass imported events without remind_in_advance set
  after_create :set_remind
  def set_remind
    self.update_column(:remind, 5)
  end


  #allow login by either username or email
  def login=(login)
  	@login = login
  end

  def login
  	@login || self.username || self.email
  end
  #overwrite devise lookup on login
  def self.find_for_database_authentication(warden_confiditions)
  	conditions = warden_confiditions.dup
  	if login = conditions.delete(:login)
  		where(conditions.to_hash).where(["lower(username) = :value OR lower(email) = :value", {:value => login.downcase}]).first
  	else
  		where(conditions.to_hash).first
  	end
  end
end
