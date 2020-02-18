class CreateMonsters < ActiveRecord::Migration[6.0]
  def change
    create_table :monsters do |t|
      t.string :name
      t.string :species
      t.string :source
      t.integer :max_hp
      t.integer :current_hp
      t.integer :xp_granted
      t.integer :armor_class
      t.integer :attack_bonus
      t.integer :damage
      t.decimal :gold
      t.belongs_to :character

      t.timestamps
    end
  end
end
