class CreateCharacters < ActiveRecord::Migration[6.0]
  def change
    create_table :characters do |t|
      t.string :name
      t.integer :level, default: 1
      t.integer :current_hp, default: 13
      t.string :armor, default: 'chain mail'
      t.string :weapon, default: 'longsword'
      t.integer :xp, default: '0'
      t.decimal :gold, precision: 15, scale: 2, default: 10
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
