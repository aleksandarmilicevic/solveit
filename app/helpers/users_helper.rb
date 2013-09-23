module UsersHelper

  @@digest_cache = {}

  # Returns the Gravatar (http://gravatar.com/) for the given user.
  def gravatar_for(user, hash={})
    gravatar_id = @@digest_cache[user.email] ||= Digest::MD5::hexdigest(user.email)
    size = hash[:size] || 50
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    ans = image_tag(gravatar_url, :alt => "#{user.name} (#{user.email})", :class => "gravatar")
    ans
  end
end
