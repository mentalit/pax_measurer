class CreateMeasurements < ActiveRecord::Migration[7.1]
  def change
    create_table :measurements do |t|
      t.float :length
      t.float :width
      t.float :depth
      t.references :room, null: false, foreign_key: true

      t.timestamps
    end
  end
end
