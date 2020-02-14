class CreateMonsters < ActiveRecord::Migration[6.0]
  def change
    create_table :monsters do |t|
      t.string :name
      t.string :type
      t.string :source
      t.integer :max_hp
      t.integer :current_hp
      t.integer :xp_granted
      t.integer :armor_class
      t.integer :to_hit_bonus
      t.string :damage

      t.timestamps
    end
  end
end
