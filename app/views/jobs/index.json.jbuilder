json.array!(@jobs) do |job|
  json.extract! job, :id, :contact, :fee, :artist, :client, :expenses, :title
  json.url job_url(job, format: :json)
end
