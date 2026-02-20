class CreateBuildings < ActiveRecord::Migration[7.1]
  def change
    create_table :buildings do |t|
      t.string :building_name
      t.text :comment
      t.string :address

      t.timestamps
    end
  end
end
