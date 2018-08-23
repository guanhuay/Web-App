class AddCustomLngToEvents < ActiveRecord::Migration
  def change
    add_column :events, :custom_lng, :float
  end
end
