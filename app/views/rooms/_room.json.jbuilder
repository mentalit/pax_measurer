json.extract! room, :id, :room_name, :comment, :building_id, :created_at, :updated_at
json.url room_url(room, format: :json)
