$:.push File.expand_path("../lib", __FILE__)
require "pifi/version"

Gem::Specification.new do |s|
  s.name         = 'pifi'
  s.version      = PiFi::VERSION
  s.licenses     = ['GPL-3.0-only']
  s.summary      = 'MPD client for listening to radio'
  s.description  = "Minimalist MPD web client for listening to radio"
  s.authors      = ["Rafael Cavalcanti"]
  s.email        = 'dev@rafaelc.org'
  s.files        = Dir.glob("{bin,lib}/**/*") + Dir.glob("{.,docs}/*.md") + %w(LICENSE docs/icon/license.pdf config.ru)
  s.executables  = ['pifi']
  s.add_dependency 'sinatra', '~> 2.0'
  s.add_dependency 'thin', '~> 1.7'
  s.add_dependency 'ruby-mpd', '~> 0.3'
  s.add_dependency 'json', '~> 2.2'
  s.add_dependency 'optimist', '~> 3.0'
  s.required_ruby_version = '>= 2.4'
  s.homepage     = 'https://rafaelc.org/pifi'
  s.metadata     = {
    "source_code_uri" => "https://rafaelc.org/pifi",
    "documentation_uri" => "https://rafaelc.org/pifi",
   }
end
