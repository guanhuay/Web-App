class AddRemindInAdvanceToEvents < ActiveRecord::Migration
  def change
    add_column :events, :remind_in_advance, :integer
  end
end
