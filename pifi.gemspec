Gem::Specification.new do |s|
  s.name         = 'pifi'
  s.version      = '0.1.0'
  s.licenses     = ['GPL-3.0-only']
  s.summary      = 'MPD client for listening to radio'
  s.description  = "Minimalist MPD web client for listening to radio"
  s.authors      = ["Rafael Cavalcanti"]
  s.email        = 'code@rafaelc.org'
  s.files        = Dir.glob("{bin,lib}/**/*") + %w(README.md INSTALL.md LICENSE docs/icon/license.pdf config.ru)
  s.executables  = ['pifi']
  s.add_dependency 'sinatra', '~> 2.0'
  s.add_dependency 'thin', '~> 1.7'
  s.add_dependency 'ruby-mpd', '~> 0.3'
  s.add_dependency 'json', '~> 2.2'
  s.add_dependency 'optimist', '~> 3.0'
  s.homepage     = 'https://github.com/rccavalcanti/pifi-radio'
  s.metadata     = {
    "source_code_uri" => "https://github.com/rccavalcanti/pifi-radio",
    "documentation_uri" => "https://github.com/rccavalcanti/pifi-radio",
   }
end
