class ChangeEndDateToEnd < ActiveRecord::Migration
  def change
    rename_column :events, :end_date, :end
  end
end
