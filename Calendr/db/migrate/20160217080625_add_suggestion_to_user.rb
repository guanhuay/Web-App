class AddSuggestionToUser < ActiveRecord::Migration
  def change
    add_column :users, :suggestion, :boolean
  end
end
