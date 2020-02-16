class CharacterSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :level, :current_hp, :armor, :weapon, :xp
  belongs_to :user
end
