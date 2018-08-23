require 'time'

class EventSerializer < ActiveModel::Serializer
  attributes :id, :title, :start, :end
	
  def start
  	object.start.iso8601
  end

  def end
  	object.end.iso8601
  end

end
