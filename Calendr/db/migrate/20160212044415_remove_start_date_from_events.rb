class RemoveStartDateFromEvents < ActiveRecord::Migration
  def change
    remove_column :events, :start_date, :datetime
  end
end
