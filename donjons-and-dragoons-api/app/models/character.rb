class Character < ApplicationRecord
  belongs_to :user

  def max_hp()
    @level * 8 + 4
  end
end
