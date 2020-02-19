class AddSeconWindUsedToCharacter < ActiveRecord::Migration[6.0]
  def change
    add_column :characters, :second_wind_used, :boolean, default: false, null: false
  end
end
