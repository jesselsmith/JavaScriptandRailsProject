class MonsterSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :species, :source, :current_hp, :max_hp, :xp_granted, :armor_class, :to_hit_bonus, :damage
end
