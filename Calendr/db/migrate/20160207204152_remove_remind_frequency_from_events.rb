class RemoveRemindFrequencyFromEvents < ActiveRecord::Migration
  def change
    remove_column :events, :remind_frequency, :integer
  end
end
