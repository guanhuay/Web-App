class AddEventFrequencyToEvents < ActiveRecord::Migration
  def change
    add_column :events, :event_frequency, :integer
  end
end
