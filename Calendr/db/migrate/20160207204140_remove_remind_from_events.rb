class RemoveRemindFromEvents < ActiveRecord::Migration
  def change
    remove_column :events, :remind, :boolean
  end
end
