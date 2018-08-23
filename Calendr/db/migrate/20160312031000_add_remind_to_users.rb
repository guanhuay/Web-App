class AddRemindToUsers < ActiveRecord::Migration
  def change
    add_column :users, :remind, :integer
  end
end
