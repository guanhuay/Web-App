class AddNotifdateToEvents < ActiveRecord::Migration
  def change
    add_column :events, :notifdate, :datetime
  end
end
