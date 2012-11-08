require 'sinatra'

get "/" do
  puts 'get'
end

post "/" do
  @data = params[:source].split(',')
  @data = @data.compact.uniq
  @data.each do |item|
    item << '.js'
  end
  @ns = params[:namespace]

  path = 'public/resources'
  input_filenames = @data

  zipfile_name = "mi.customize.zip"

  t = Tempfile.new(zipfile_name)
  Zip::ZipOutputStream.open(t.path) do |zipfile|
    zipfile.put_next_entry('mi.core.js')
    text = ""
    text << "window.$NAMESPACE = {};\n\n"

    input_filenames.each do |filename|
      # Two arguments:
      # - The name of the file as it will appear in the archive
      # - The original file, including the path to find it
      text << IO.read(path + '/' + filename)
      text << "\n\n"
    end

    output = text.gsub('$NAMESPACE', @ns)
    zipfile.print output
  end

  send_file t.path, :type => 'application/zip', :disposition => :attachment, :filename => zipfile_name
  t.close
end