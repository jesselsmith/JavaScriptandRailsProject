class CreateCharacters < ActiveRecord::Migration[6.0]
  def change
    create_table :characters do |t|
      t.string :name
      t.integer :level
      t.integer :current_hp
      t.string :armor
      t.string :weapon
      t.integer :xp
      t.decimal :gold, precision: 15, scale: 2
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
