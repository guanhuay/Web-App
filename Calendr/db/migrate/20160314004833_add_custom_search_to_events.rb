class AddCustomSearchToEvents < ActiveRecord::Migration
  def change
    add_column :events, :custom_search, :string
  end
end
