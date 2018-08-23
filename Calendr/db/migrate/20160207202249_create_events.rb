class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :name
      t.datetime :start_date
      t.datetime :end_date
      t.string :location
      t.text :notes
      t.boolean :remind
      t.integer :remind_frequency

      t.timestamps null: false
    end
  end
end
