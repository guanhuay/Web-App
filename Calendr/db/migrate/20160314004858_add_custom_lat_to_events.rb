class AddCustomLatToEvents < ActiveRecord::Migration
  def change
    add_column :events, :custom_lat, :float
  end
end
