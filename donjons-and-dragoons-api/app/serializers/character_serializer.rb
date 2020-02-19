class CharacterSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :level, :current_hp, :max_hp, :armor, :weapon, :xp,
             :appropriate_crs_to_fight, :gold, :hit_dice, :second_wind_used,
             :encounters_since_short_rest, :encounters_since_long_rest
  belongs_to :user
  has_one :monster
end
