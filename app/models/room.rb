class Room < ApplicationRecord
  belongs_to :building
  has_many :measurements
end
