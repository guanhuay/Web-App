class CreateTestusers < ActiveRecord::Migration
  def change
    create_table :testusers do |t|
      t.string :name
      t.string :email
      t.boolean :validated

      t.timestamps null: false
    end
  end
end
