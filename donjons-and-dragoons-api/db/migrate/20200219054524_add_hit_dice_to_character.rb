class AddHitDiceToCharacter < ActiveRecord::Migration[6.0]
  def change
    add_column :characters, :hit_dice, :integer, default: 1
  end
end
