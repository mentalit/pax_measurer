class CreateRooms < ActiveRecord::Migration[7.1]
  def change
    create_table :rooms do |t|
      t.string :room_name
      t.text :comment
      t.references :building, null: false, foreign_key: true

      t.timestamps
    end
  end
end
