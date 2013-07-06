require 'erb'
require 'red/red'
require 'sdg_utils/meta_utils'

module ApplicationHelper

  def meta
    Red.meta
  end

  def trigger(event_name, hash={})
    event_name = event_name.to_s
    ev_cls = meta.find_event(event_name)
    params = hash[:params] || {}
    text = hash[:text] || ev_cls.relative_name
    href = "/event?" + {:name => ev_cls.name}.to_query + "&params=" + u(params.to_json)
    "<a href=\"#{href}\" data-remote=\"true\">#{text}</a>".html_safe
  end

  @@transl = {
    "doc" => "application__word",
    "docx" => "application__word",
    "xls" => "application__excel",
    "xlsx" => "application__excel",
    "ppt" => "application__powerpoint",
    "pptx" => "application__powerpoint",
    "key" => "application__keynote",
    "zip" => "application__compressed",
    "7z" => "application__compressed",
    "rar" => "application__compressed",
    "gz" => "application__compressed",
    "tgz" => "application__compressed",
    "bz" => "application__compressed",
    "tbz" => "application__compressed",
  }

  def icon_src(file_record)
    return unless file_record
    check = Proc.new do |ctype|
      src = "file_types/#{ctype}.png"
      if Rails.application.assets.find_asset(src)
        puts "########### checking #{src}"
        return src
      end
    end

    translate = lambda do
      ext = file_record.filename.match(/[^\.]*$/).to_s.downcase
      @@transl[ext]
    end

    begin
      check.call file_record.content_type.gsub("/", "__")
      check.call translate.call()
      check.call file_record.content_type.match(/^[^\/]*/).to_s + "__"
      check.call "_file" # this should not fail
    rescue e
      Red.conf.log.error(e)
      "#"
    end
  end

  def client
    #TODO don't hardcode Client
    session[:client] ||= Client.create!
  end

  def server
    #TODO don't hardcode Server
    $red_server ||= Server.create!
  end

  def js_namespace
    "jRed.leaderboard"
  end

end
