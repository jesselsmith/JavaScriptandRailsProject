class CharacterSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :level, :current_hp, :max_hp, :armor, :weapon, :xp, :appropriate_crs_to_fight, :gold
  belongs_to :user
end
