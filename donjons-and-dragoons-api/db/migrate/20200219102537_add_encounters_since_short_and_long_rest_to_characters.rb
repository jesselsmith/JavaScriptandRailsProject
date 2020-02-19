class AddEncountersSinceShortAndLongRestToCharacters < ActiveRecord::Migration[6.0]
  def change
    add_column :characters, :encounters_since_short_rest, :integer, default: 0, null: false
    add_column :characters, :encounters_since_long_rest, :integer, default: 0, null: false
  end
end
