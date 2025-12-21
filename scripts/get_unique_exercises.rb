require 'json'

# Path to the data file
file_path = File.join(Dir.pwd, 'src/data/data_large.json')

unless File.exist?(file_path)
  puts "Error: File not found at #{file_path}"
  puts "Please run this script from the project root directory."
  exit 1
end

puts "Reading data from #{file_path}..."
file_content = File.read(file_path)
data = JSON.parse(file_content)

exercises = data['exerciseStore']['exercises']

puts "Total exercises found: #{exercises.length}"
puts "First exercise sample: #{exercises.first.inspect}"

unique_names = exercises.map { |e| e['equipment'] }.flatten.uniq.sort.flatten

puts "Found #{unique_names.length} unique exercises:"
puts unique_names.inspect
