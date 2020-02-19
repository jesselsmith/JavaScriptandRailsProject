class CharacterSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :level, :current_hp, :max_hp, :armor, :weapon, :xp, :appropriate_crs_to_fight, :gold, :hit_dice
  belongs_to :user
  has_one :monster
end
